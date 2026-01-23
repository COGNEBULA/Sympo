const {
  updateSecondEmailService
} = require("../services/second_email_service");

/**
 * POST /api/second_email
 * Body:
 * {
 *   "registration_id": "18"
 * }
 */
async function updateSecondEmail(req, res, next) {
  try {
    let { registration_id, second_email } = req.body;

    if (!registration_id) {
      return res.status(400).json({
        success: false,
        message: "registration_id is required"
      });
    }

    // normalize
    const regId = Number(registration_id);
    if (isNaN(regId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration_id"
      });
    }
    const result = await updateSecondEmailService(regId, second_email);
    return res.status(result.status).json(result.response);

  } catch (err) {
    next(err);
  }
}

module.exports = {
  updateSecondEmail
};
