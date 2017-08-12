import db from '../database'
import dbUtils from '../database/utils'
import createError from 'http-errors'
import progressiveSchema from '../schemas/progressive'
const uuid = require('uuid/v4')

export default {
  create (model, tenant) {
    if (!model) return Promise.reject(createError(406, 'Entity is not in good form'))
    model.id = uuid()
    model.tenant = tenant
    let validation = progressiveSchema.validateNew(model)
    if (validation === null) {
      // validation pass
      let params = dbUtils.getQueryParams(model)
      return db.one(`INSERT INTO progressive 
      (${params.fields.join(',')}) 
      VALUES
      (${params.placeholders.join(',')}) RETURNING id`, params.values)
    } else {
      throw createError(406, validation.details[0].message)
    }
  },
  findByType (type, tenant) {
    if (!type || !tenant) return Promise.reject(createError(406, 'Entity is not in good form'))
    return db.any(`SELECT * FROM progressive WHERE type = $1 and tenant = $2`, [type, tenant])
  },
  increment (type, tenant) {
    if (!type || !tenant) return Promise.reject(createError(406, 'Entity is not in good form'))
    let query = `UPDATE progressive SET counter = countre + 1 WHERE type = $1 AND tenant = $2`
    return db.none(query, [type, tenant])
  }
}
