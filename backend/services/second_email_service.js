const { getClient } = require("../config/db");

async function updateSecondEmailService(registration_id, second_email) {
    const client = await getClient();

    try {
        await client.query("BEGIN");

        /* =====================================================
           1️⃣ CHECK PARTICIPANT EXISTS
        ===================================================== */
        const participant = await client.query(
            `
      SELECT id, checkin
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

        /* =====================================================
           2️⃣ UPDATE SECOND EMAIL
        ===================================================== */
        await client.query(
            `
      UPDATE registrations
      SET
        second_email = $2
      WHERE id = $1
      `,
            [registration_id, second_email]
        );

        await client.query("COMMIT");

        return {
            status: 200,
            response: {
                success: true,
                message: "Second email updated successfully",
                data: {
                    registration_id,
                    second_email
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
    updateSecondEmailService
};
