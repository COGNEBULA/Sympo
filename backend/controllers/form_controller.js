const { query } = require("../config/db");

async function formcontroller(req, res) {
  try {
    const { name, email, phone, college, student_year, food } = req.body;

    if (!name || !email || !phone || !college || !student_year || !food) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await query(
      `INSERT INTO register 
       (name, email, phone, college, year, food)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, email, phone, college, student_year, food]
    );

    return res.status(201).json({
      message: "Registration successful"
    });

  } catch (error) {
    console.error("Form Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
}

module.exports = {formcontroller};
