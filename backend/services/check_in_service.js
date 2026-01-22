const { getClient } = require("../config/db");
const { checkInMail } = require("./mail_service");
const { buildReceiptData } = require("../helpers/receipt_helper");

async function checkInParticipantService(registration_id) {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    /* =====================================================
       1️⃣ CHECK PARTICIPANT EXISTS
    ===================================================== */
    const participant = await client.query(
      `
      SELECT *
      FROM registrations
      WHERE id = $1
      FOR UPDATE
      `,
      [registration_id]
    );

    if (participant.rowCount === 0) {
      return {
        status: 404,
        response: {
          success: false,
          message: "Participant not found"
        }
      };
    }

    if (participant.rows[0].checkin === true) {
      return {
        status: 409,
        response: {
          success: false,
          message: "Participant already checked in"
        }
      };
    }

    /* =====================================================
       2️⃣ UPDATE CHECK-IN + SECOND EMAIL
    ===================================================== */
    await client.query(
      `
      UPDATE registrations
      SET
        checkin = true
      WHERE id = $1
      `,
      [registration_id]
    );

    checkInMail(await buildReceiptData(participant.rows[0]));

    await client.query("COMMIT");

    return {
      status: 200,
      response: {
        success: true,
        message: "Check-in successful",
        data: {
          registration_id
        }
      }
    };

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  checkInParticipantService
};
