import Joi from "joi";

export const eventSchema = Joi.object({
  eventId: Joi.string().optional(),
  timestamp: Joi.date().required(),
  userId: Joi.string().required(),
  sessionId: Joi.string().optional(),
  route: Joi.string().required(),
  action: Joi.string().required(),
  metadata: Joi.object().optional()
});

export function validateEvent(e) {
  const { error, value } = eventSchema.validate(e, { stripUnknown: true });
  if (error) throw error;
  return value;
}
