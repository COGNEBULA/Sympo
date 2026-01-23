const { getClient } = require("../config/db");

const { sendWelcomeMail } = require("../services/mail_service");
const { appendToGoogleSheet } = require("../services/excel_service");
const { buildReceiptData } = require("../helpers/receipt_helper");

const {
  ValidationError,
  ConflictError
} = require("../errors/error");

exports.createRegistration = async (req, res, next) => {
  const client = await getClient();

  try {
    /* ===============================
       HANDLE SINGLE TEXT JSON INPUT
    =============================== */
    if (req.body.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch {
        throw new ValidationError("Invalid JSON in data field");
      }
    }

    const {
      name,
      phone,
      email,
      college,
      student_year,
      events,
      teamname,
      food,
      transaction_id
    } = req.body;
    console.log(req.body);
    console.log(name, phone, email, college, student_year, events, teamname, food, transaction_id);
    /* 🔍 Validations */
    if (!name || !phone || !email || !college || !student_year || !food || !teamname) {
      throw new ValidationError("Missing required fields");
    }

    if (!Array.isArray(events) || events.length === 0) {
      throw new ValidationError("At least one event is required");
    }

    // if (!req.file) {
    //   throw new ValidationError("Payment screenshot is required");
    // }

    await client.query("BEGIN");

    /* 🚫 Duplicate email check */
    const duplicate = await client.query(
      "SELECT id FROM registrations WHERE email = $1",
      [email]
    );

    if (duplicate.rowCount > 0) {
      throw new ConflictError("Email already registered");
    }

    /* 💾 Insert registration */
    const insertQuery = `
      INSERT INTO registrations (
        name,
        phone,
        email,
        college,
        student_year,
        events,
        teamname,
        food,
        transaction_id,
        screenshot_path
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
    `;

    const values = [
      name,
      phone,
      email,
      college,
      student_year,
      events,
      teamname,
      food,
      transaction_id || null,
      // req.file.path
      email
    ];

    const { rows } = await client.query(insertQuery, values);
    const registration = rows[0];

    /* 🧾 Build receipt */
    const receiptData = await buildReceiptData(registration);

    /* 📧 Send mail */
    await sendWelcomeMail(receiptData);

    /* 📊 Append Google Sheet */
    await appendToGoogleSheet(registration);

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: registration
    });

  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
};

// controllers/upi.controller.js

exports.sendupi =async (req, res, next) => {
  try {
    if (!process.env.UPI_ID) {
      throw new Error("UPI_ID not configured");
    }

    res.status(200).json({
      success: true,
      upiId: process.env.UPI_ID
    });
  } catch (error) {
    next(error); // 🔥 send to global error handler
  }
}



