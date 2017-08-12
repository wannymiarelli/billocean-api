import db from '../database'
import dbUtils from '../database/utils'
import crypto from 'crypto'
import userSchema from '../schemas/user'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'
const uuid = require('uuid/v4')

export default {
  create (model) {
    model.id = uuid()
    const validate = userSchema.validateNew(model)
    if (validate === null) {
      const password = securePassword(model.password, getRandomSalt())
      model.password = password.hash
      model.salt = password.salt
      let params = dbUtils.getQueryParams(model)
      const query = `INSERT INTO users 
      (${params.fields.join(',')}) 
      VALUES 
      (${params.placeholders.join(',')}) 
      RETURNING id`
      return db.one(query, params.values)
    } else {
      return Promise.reject(validate)
    }
  },
  findByEmail (email) {
    if (!email || email.length <= 0) {
      return Promise.reject(createError(406, 'Email missing'))
    }
    return db.one('SELECT * FROM users WHERE email = $1 LIMIT 1', [email])
  },
  authenticate (email, password) {
    const validate = userSchema.validateLogin({email: email, password: password})
    if (validate === null) {
      return this.findByEmail(email).then((user) => {
        let providedHash = securePassword(password, user.salt)
        if (checkPassword(user, providedHash)) {
          // password okay
          return Promise.resolve(generateToken(user))
        } else {
          // password wrong
          return Promise.reject(createError(401, 'Invalid credentials'))
        }
      }).catch(() => {
        return Promise.reject(createError(401, 'Invalid credentials'))
      })
    } else {
      return Promise.reject(createError(406, validate.details[0].message))
    }
  }
}

function getRandomSalt () {
  return crypto.randomBytes(Math.ceil(16 / 2))
      .toString('hex')
      .slice(0, 16)
}

function securePassword (password, salt) {
  let hash = crypto.createHmac('sha512', salt)
  hash.update(password)
  let value = hash.digest('hex')
  return {
    salt: salt,
    hash: value
  }
}

function checkPassword (dbHash, providedHash) {
  if (dbHash.salt === providedHash.salt &&
    dbHash.password === providedHash.hash) {
    return true
  } else {
    return false
  }
}

function generateToken (user) {
  return jwt.sign({id: user.id, active: user.active}, 'secret!bioceanéé**ààòò', {
    algorithm: 'HS256'
  })
}
