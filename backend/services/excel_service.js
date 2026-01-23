const axios = require("axios");

/* ===============================
   APPEND TO GOOGLE SHEET
   (NON-CRITICAL SIDE EFFECT)
=============================== */
async function appendToGoogleSheet(registration) {
  try {
    const payload = {
      timestamp: new Date().toISOString(),
      id : registration.id,
      name: registration.name,
      phone: registration.phone,
      email: registration.email,
      college: registration.college,
      student_year: registration.student_year,
      events: registration.events,   
      teamname : registration.teamname,        // array
      food: registration.food,
      transaction_id: registration.transaction_id || "",
      screenshot_path: registration.screenshot_path
    };

    const response = await axios.post(
      process.env.GSHEET_WEBHOOK_URL,
      payload,
      {
        timeout: 5000,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (response.status !== 200) {
      throw new Error(`Unexpected status: ${response.status}`);
    }

    return true; // ✅ success

  } catch (err) {
    /* -----------------------------
       DO NOT THROW (side-effect)
       LOG ONLY
    ----------------------------- */
    if (err.response) {
      console.error("📄 Google Sheet Error:", {
        status: err.response.status,
        data: err.response.data
      });
    } else if (err.request) {
      console.error("📄 Google Sheet Timeout / No Response");
    } else {
      console.error("📄 Google Sheet Internal Error:", err.message);
    }

    return false; // ❌ failure (safe)
  }
}

module.exports = { appendToGoogleSheet };
