const {
  sendCertificatesForCoordinatorEvent
} = require("../services/certificate_service");

/**
 * POST /api/certificates/coordinator
 * Body:
 * {
 *   "registrationIds": [1,2,3],
 *   "eventName": "HackQuest"
 * }
 */
async function sendCoordinatorCertificates(req, res) {
  try {
    const { registrationIds, eventName } = req.body;

    // 🔒 Validation
    if (
      !Array.isArray(registrationIds) ||
      registrationIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "registrationIds must be a non-empty array"
      });
    }

    if (!eventName || typeof eventName !== "string") {
      return res.status(400).json({
        success: false,
        message: "eventName is required and must be a string"
      });
    }

    // 🚀 Call service
    await sendCertificatesForCoordinatorEvent(
      registrationIds,
      eventName
    );

    return res.status(200).json({
      success: true,
      message: `Certificate processing started for event: ${eventName}`
    });

  } catch (error) {
    console.error("❌ Certificate Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send certificates",
      error: error.message
    });
  }
};
module.exports = {
  sendCoordinatorCertificates
};