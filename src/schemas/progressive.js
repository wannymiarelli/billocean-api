import Joi from 'joi'

const createSchema = Joi.object().keys({
  id: Joi.string().required(),
  type: Joi.string(),
  counter: Joi.number(),
  tenant: Joi.string().min(36).max(36).required()
})

export default {
  validateNew (model) {
    const result = Joi.validate(model, createSchema)
    return result.error
  }
}
