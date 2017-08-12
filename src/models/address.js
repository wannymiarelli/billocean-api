import db from '../database'
import addressSchema from '../schemas/address'
import Promise from 'promise'
import createError from 'http-errors'
const uuid = require('uuid/v4')

export default {
  all (customer, tenant) {
  },
  create (model) {
    return new Promise((resolve, reject) => {
      model.id = uuid()
      let params = db.buildParams(model)
      const validate = addressSchema.validateNew(model)
      if (validate === null) {
        // the model sent seems valid
        db.getPool().then((client) => {
          client.query({
            text: `INSERT INTO address(${params.keys}) VALUES (${params.placeholders})`,
            values: params.values
          }).then((result) => {
            client.end()
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
        })
        .catch((error) => {
          reject(error)
        })
      } else {
        reject(createError(406, validate.details[0].message))
      }
    })
  }
}
