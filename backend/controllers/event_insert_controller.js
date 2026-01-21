const {
  registerParticipantsToEventService
} = require("../services/event_insert_service");

/**
 * POST /api/coordinator/register-participant
 * Body:
 * {
 *   "participant_ids": "18" | "18,19,20",
 *   "team_name": "HAri" | ""
 * }
 */
async function registerParticipantToEvent(req, res, next) {
  try {
    const role = req.session?.user?.role;
    let { participant_ids, team_name } = req.body;

    // Normalize empty string to null
    team_name =
      typeof team_name === "string" && team_name.trim() === ""
        ? null
        : team_name;

    if (!role) {
      return res.status(403).json({
        success: false,
        message: "Coordinator role not found in session"
      });
    }

    if (!participant_ids || typeof participant_ids !== "string") {
      return res.status(400).json({
        success: false,
        message: "participant_ids must be a string"
      });
    }

    const result = await registerParticipantsToEventService(
      role,
      participant_ids,
      team_name
    );

    return res.status(result.status).json(result.response);

  } catch (err) {
    next(err);
  }
}

module.exports = {
  registerParticipantToEvent
};
