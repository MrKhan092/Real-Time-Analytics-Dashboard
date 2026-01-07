// backend/src/middleware/validateEvent.js
import Joi from "joi";

const eventSchema = Joi.object({
  eventId: Joi.string().optional(),
  timestamp: Joi.date().iso().optional(),
  userId: Joi.string().optional(),
  sessionId: Joi.string().optional(),
  route: Joi.string().max(200).required(),
  action: Joi.string().max(200).required(),
  metadata: Joi.any().optional()
});

export function validateEventPayload(payload) {
  const { error, value } = eventSchema.validate(payload);
  if (error) throw error;
  return value;
}
