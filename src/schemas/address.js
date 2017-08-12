import Joi from 'joi'

const createSchema = Joi.object().keys({
  id: Joi.string().max(36).required(),
  address: Joi.string().max(250).required(),
  zip: Joi.string().max(10).allow(null),
  city: Joi.string().max(100).allow(null),
  country: Joi.string().max(150).allow(null),
  tenant: Joi.string().max(36).required(),
  customer_id: Joi.string().max(36).required()
})

const updateSchema = Joi.object().keys({
  id: Joi.string().max(36).required(),
  address: Joi.string().max(250),
  zip: Joi.string().max(10).allow(null),
  city: Joi.string().max(100).allow(null),
  country: Joi.string().max(150).allow(null),
  tenant: Joi.string().max(36).required(),
  customer_id: Joi.string().max(36).required()
})

export default {
  validateNew (model) {
    const result = Joi.validate(model, createSchema)
    return result.error
  },
  validateUpdate (model) {
    const result = Joi.validate(model, updateSchema)
    return result.error
  }
}
