const { getClient } = require("../config/db");

async function fetchCoordinatorParticipants(role) {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    /* =====================================================
       🔹 ALL CHECKED-IN PARTICIPANTS (by event name)
    ===================================================== */
    const participantsResult = await client.query(
      `
      SELECT
        id AS registration_id,
        name,
        phone AS mobile,
        email,
        college,
        student_year AS year
      FROM registrations
      WHERE
        checkin = true
        AND $1 = ANY(events)
      ORDER BY name
      `,
      [role]
    );

    /* =====================================================
       🌅 MORNING SESSION PARTICIPANTS (NOT AVAILABLE)
       → RETURN EMPTY DATA TO PRESERVE RESPONSE LOGIC
    ===================================================== */
    const morningParticipantsResult = {
      rowCount: 0,
      rows: []
    };

    /* =====================================================
       🌆 AFTERNOON SESSION PARTICIPANTS (NOT AVAILABLE)
       → RETURN EMPTY DATA TO PRESERVE RESPONSE LOGIC
    ===================================================== */
    const afternoonParticipantsResult = {
      rowCount: 0,
      rows: []
    };

    await client.query("COMMIT");

    /* =====================================================
       ✅ FINAL RESPONSE (UNCHANGED)
    ===================================================== */
    return {
      totalCount: participantsResult.rowCount,
      participants: participantsResult.rows 
    };

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  fetchCoordinatorParticipants
};
