const { getRegistrationData } = require("../services/get_registration_data_service");

async function getRegistrationController(req, res, next) {
    try {
        const result = await getRegistrationData();
        return res.status(200).json({
            success: true,
            registrationData: result
        });
    }
    catch (err) {
        throw err;
    }
}

module.exports = { getRegistrationController };