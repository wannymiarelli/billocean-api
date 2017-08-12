import Joi from 'joi'

const createSchema = Joi.object().keys({
  id: Joi.string().max(36).required(),
  name: Joi.string().max(250).required(),
  description: Joi.string(),
  tranches: Joi.array().items(Joi.number()),
  days: Joi.array().items(Joi.number()),
  end: Joi.boolean().default(true)
})

export default {
  validateNew (model) {
    const result = Joi.validate(model, createSchema)
    return result.error
  }
}
