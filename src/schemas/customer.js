import Joi from 'joi'

const createSchema = Joi.object().keys({
  id: Joi.string().required(),
  active: Joi.boolean().default(true),
  code: Joi.string().max(50),
  customer: Joi.boolean(),
  name: Joi.string().min(3).required(),
  vat: Joi.string().allow(null),
  fiscal: Joi.string().allow(null),
  phone: Joi.string().allow(null),
  defaultpayment: Joi.string().max(36),
  cell: Joi.string().allow(null),
  email: Joi.string().email().allow(null),
  website: Joi.string().allow(null),
  bankname: Joi.string().allow(null),
  agencyname: Joi.string().allow(null),
  iban: Joi.string().allow(null),
  bic: Joi.string().allow(null),
  swift: Joi.string().allow(null),
  address: Joi.array().allow(null),
  tenant: Joi.string().min(36).max(36).required()
})

const updateSchema = Joi.object().keys({
  id: Joi.string().required(),
  active: Joi.boolean().default(true),
  code: Joi.string().max(50),
  customer: Joi.boolean(),
  name: Joi.string().min(3),
  vat: Joi.string().allow(null),
  fiscal: Joi.string().allow(null),
  phone: Joi.string().allow(null),
  defaultpayment: Joi.string().max(36),
  cell: Joi.string().allow(null),
  email: Joi.string().email().allow(null),
  website: Joi.string().allow(null),
  bankname: Joi.string().allow(null),
  agencyname: Joi.string().allow(null),
  iban: Joi.string().allow(null),
  bic: Joi.string().allow(null),
  swift: Joi.string().allow(null),
  tenant: Joi.string().min(36).max(36).required()
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
