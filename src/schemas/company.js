import Joi from 'joi'

const createSchema = Joi.object().keys({
  id: Joi.string().max(36).required(),
  name: Joi.string().min(3).max(200).required(),
  vat: Joi.string().email().required().allow(null),
  fiscal: Joi.string().allow(null),
  address: Joi.string().allow(null),
  phone: Joi.string().allow(null),
  logoUrl: Joi.uri().allow(null),
  tenant: Joi.string().min(36).max(36).required()
})

export default {
  validateNew (model) {
    const result = Joi.validate(model, createSchema)
    return result.error
  }
}
