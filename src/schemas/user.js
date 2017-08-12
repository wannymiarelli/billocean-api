import Joi from 'joi'

const createSchema = Joi.object().keys({
  id: Joi.string().max(36).required(),
  name: Joi.string().min(3).max(150).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().regex(/^[a-zA-Z0-9]{3,30}$/),
  active: Joi.boolean()
})

const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required().regex(/^[a-zA-Z0-9]{3,30}$/)
})

export default {
  validateNew (model) {
    const result = Joi.validate(model, createSchema)
    return result.error
  },
  validateLogin (model) {
    const result = Joi.validate(model, loginSchema)
    return result.error
  }
}
