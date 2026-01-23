const {
  checkInParticipantService
} = require("../services/check_in_service");

/**
 * POST /api/checkin
 * Body:
 * {
 *   "registration_id": "18"
 * }
 */
async function checkInParticipant(req, res, next) {
  try {
    let { registration_id } = req.body;

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
    const result = await checkInParticipantService(regId);
    return res.status(result.status).json(result.response);

  } catch (err) {
    next(err);
  }
}

module.exports = {
  checkInParticipant
};
