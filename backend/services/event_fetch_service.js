const { getClient } = require("../config/db");

async function fetchCoordinatorParticipants(role) {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    const participantsResult = await client.query(
      `
      SELECT
        id AS registration_id,
        name,
        phone AS mobile,
        email,
        college,
        student_year AS year,
        events,
        teamName
      FROM registrations
      WHERE
        checkin = true
        AND $1::TEXT = ANY(events)
      ORDER BY name
      `,
      [role]
    );

    await client.query("COMMIT");

    /* =====================================================
       🔹 Handle the individul=al Events 
    ===================================================== */

    const isIndividualEvent = participantsResult.rows.every(row => {
      const eventIndex = Array.isArray(row.events)
        ? row.events.indexOf(role)
        : -1;

      if (eventIndex === -1) return true;

      return !(
        Array.isArray(row.teamname) &&
        row.teamname[eventIndex]
      );
    });

    if (isIndividualEvent) {
      return {
        totalCount: participantsResult.rowCount,
        participants: participantsResult.rows.map(row => ({
          registration_id: row.registration_id,
          name: row.name,
          mobile: row.mobile,
          email: row.email,
          college: row.college,
          year: row.year
        }))
      };
    }

    /* =====================================================
       🔹 TEAM OBJECT → { teamName: [members] }
       (event-index based mapping)
    ===================================================== */
    const teams = {};

    for (const row of participantsResult.rows) {
      // find index of event
      const eventIndex = Array.isArray(row.events)
        ? row.events.indexOf(role)
        : -1;

      if (eventIndex === -1) continue;

      // get team name using SAME index
      const team =
        Array.isArray(row.teamname) && row.teamname[eventIndex]
          ? row.teamname[eventIndex]
          : null;

      if (!team) continue;

      // create team array if not exists
      if (!teams[team]) {
        teams[team] = [];
      }

      // push member document
      teams[team].push({
        registration_id: row.registration_id,
        name: row.name,
        mobile: row.mobile,
        email: row.email,
        college: row.college,
        year: row.year,
        teamName: team
      });
    }
    const indexedParticipants = {};
    let index = 1;

    for (const team in teams) {
      indexedParticipants[index] = teams[team];
      index++;
    }

    /* =====================================================
       ✅ FINAL RESPONSE
    ===================================================== */
    return {
      totalCount: participantsResult.rowCount,
      participants: indexedParticipants
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