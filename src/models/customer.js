import db from '../database'
import dbUtils from '../database/utils'
import progressiveModel from './progressive'
import customerSchema from '../schemas/customer'
import addressSchema from '../schemas/address'
import createError from 'http-errors'
const uuid = require('uuid/v4')

export default {
  all (tenant) {
    // return all users
    if (tenant) {
      return db.any('SELECT * FROM customers WHERE tenant = $1', [tenant])
    } else {
      return Promise.reject(createError(406, 'Token Missing'))
    }
  },
  findById (id, tenant) {
    if (!id || !tenant) return Promise.reject(createError(406, 'Customer Id missing'))
    return db.oneOrNone(`SELECT row_to_json(c) as data
    from (
      select *,
      (
        select array_to_json(array_agg(row_to_json(a)))
        from (
          select * from address
          where customer_id = customers.id AND tenant = $2
        ) as a
      ) as address
      from customers
      where customers.id = $1 and tenant = $2
    ) c`, [id, tenant])
  },
  findByVat (vat, tenant) {
    if (!vat || !tenant) return Promise.reject(createError(406, 'Vat number missing'))
    return db.oneOrNone(`SELECT * FROM customers WHERE vat = $1 AND tenant = $2`, [vat, tenant])
  },
  findByFiscal (fiscal, tenant) {
    if (!fiscal) return Promise.reject(createError(406, 'Email number missing'))
    return db.oneOrNone(`SELECT * FROM customers WHERE fiscal = $1 AND tenant = $2`, [fiscal, tenant])
  },
  create (model, tenant) {
    // Validation
    if (!model.customer) return Promise.reject(createError(406, 'Entity is not in good form'))
    model.customer.id = uuid()
    model.customer.tenant = tenant
    let validation = customerSchema.validateNew(model.customer)
    if (validation === null) {
      return db.task(t => {
        let params = dbUtils.getQueryParams(model.customer)
        let query = `INSERT INTO customers 
        (${params.fields.join(',')}) 
        VALUES 
        (${params.placeholders.join(',')}) 
        RETURNING id`
        return t.one(query, params.values)
          .then((customer) => {
            progressiveModel.increment('customer', tenant)
            // cliente creato, se presenti creo gli indirizzi
            if (model.address && model.address.length > 0) {
              let batchQuery = []
              model.address.forEach((address) => {
                address.id = uuid()
                address.tenant = tenant
                address.customer_id = customer.id
                validation = addressSchema.validateNew(address)
                if (validation === null) {
                  let params = dbUtils.getQueryParams(address)
                  query = `INSERT INTO address 
                  (${params.fields.join(',')}) 
                  VALUES 
                  (${params.placeholders.join(',')})`
                  batchQuery.push({
                    q: query,
                    v: params.values
                  })
                } else {
                  throw createError(406, validation.details[0].message)
                }
              })
              return t.batch(batchQuery.map(q => {
                return t.none(q.q, q.v)
              }))
            }
          })
      })
    } else {
      return Promise.reject(createError(406, validation.details[0].message))
    }
  },
  update (model, tenant) {
    if (!model.customer.id) return Promise.reject(createError(406, 'The given object cannot be searched on the database - id field missing'))
    // extract form the model the address arrays
    let customer = model.customer
    let validation = customerSchema.validateUpdate(customer)
    if (validation === null) {
      // validation okay - lest update the object
      return db.task(t => {
        let params = dbUtils.getQueryParams(customer)
        let query = `UPDATE customers SET ${dbUtils.getUpdateQuery(params.fields, params.placeholders)} WHERE id = $${(params.placeholders.length + 1)} AND tenant = $${(params.placeholders.length + 2)}`
        params.values.push(model.customer.id, tenant)
        return t.none(query, params.values).then(() => {
          // customer update proceed with the address
          if (model.address && model.address.length) {
            let batchQuery = []
            model.address.forEach((address) => {
              validation = addressSchema.validateUpdate(address)
              if (validation === null) {
                delete address.customer_id
                let params = dbUtils.getQueryParams(address)
                let query = `UPDATE address SET ${dbUtils.getUpdateQuery(params.fields, params.placeholders)} WHERE id = $${(params.placeholders.length + 1)} AND tenant = $${(params.placeholders.length + 2)} AND customer_id = $${(params.placeholders.length + 3)}`
                params.values.push(address.id, tenant, model.id)
                batchQuery.push({
                  q: query,
                  v: params.values
                })
              } else {
                throw createError(406, validation.details[0].message)
              }
            })
            return t.batch(batchQuery.map(q => {
              return t.none(q.q, q.v)
            }))
          }
        })
      })
    } else {
      return Promise.reject(createError(406, validation.details[0].message))
    }
  }
}
