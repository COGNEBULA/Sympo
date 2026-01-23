const { getClient } = require("../config/db");

async function getRegistrationData(role) {
    const client = await getClient();

    try {
        const registrationData = await client.query(
            `SELECT * FROM registrations ORDER BY id`
        );

        return {
            registrationData: registrationData.rows
        };

    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
}

module.exports = {
    getRegistrationData
};
