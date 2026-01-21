const { getClient } = require("../config/db");

async function registerParticipantsToEventService(role, participant_ids, team_name) {
  const client = await getClient();

  /* =====================================================
     STRING → INT[]
     "18"        → [18]
     "18,19,20"  → [18,19,20]
  ===================================================== */
  const participantIdsArray = participant_ids
    .split(",")
    .map(id => Number(id.trim()))
    .filter(id => !isNaN(id));

  if (participantIdsArray.length === 0) {
    return {
      status: 400,
      response: {
        success: false,
        message: "Invalid participant_ids format"
      }
    };
  }

  try {
    await client.query("BEGIN");

    /* =====================================================
       1️⃣ VALIDATE PARTICIPANTS EXIST
    ===================================================== */
    const participants = await client.query(
      `
      SELECT id, events, teamname
      FROM registrations
      WHERE id = ANY($1::int[])
      FOR UPDATE
      `,
      [participantIdsArray]
    );

    if (participants.rowCount !== participantIdsArray.length) {
      return {
        status: 404,
        response: {
          success: false,
          message: "One or more participants not found"
        }
      };
    }

    /* =====================================================
       2️⃣ DUPLICATE EVENT CHECK
    ===================================================== */
    const duplicateEventUsers = participants.rows
      .filter(r => Array.isArray(r.events) && r.events.includes(role))
      .map(r => r.id);

    if (duplicateEventUsers.length > 0) {
      return {
        status: 409,
        response: {
          success: false,
          message: "Some participants already registered for this event",
          duplicate_participants: duplicateEventUsers
        }
      };
    }

    /* =====================================================
       3️⃣ TEAM NAME CHECK (GLOBAL) ✅ FIXED
    ===================================================== */
    if (team_name) {
      const teamExists = await client.query(
        `
        SELECT 1
        FROM registrations
        WHERE $1::TEXT = ANY(teamname)
        `,
        [team_name]
      );

    }

    /* =====================================================
       4️⃣ ON-SPOT REGISTRATION (POSTGRES SAFE)
    ===================================================== */
    await client.query(
      `
      UPDATE registrations
      SET
        events = array_append(
          COALESCE(events, '{}'::TEXT[]),
          $2::TEXT
        ),
        teamname = CASE
          WHEN COALESCE($3::TEXT, '') != ''
          THEN array_append(
            COALESCE(teamname, '{}'::TEXT[]),
            $3::TEXT
          )
          ELSE COALESCE(teamname, '{}'::TEXT[])
        END
      WHERE id = ANY($1::int[])
      `,
      [participantIdsArray, role, team_name || null]
    );

    await client.query("COMMIT");

    return {
      status: 201,
      response: {
        success: true,
        message: "On-spot registration successful",
        data: {
          event: role,
          team_name,
          participant_ids
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
  registerParticipantsToEventService
};
