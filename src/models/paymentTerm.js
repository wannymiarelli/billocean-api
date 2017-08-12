import db from '../database'
// import dbUtils from '../database/utils'
// import paymentTerm from '../schemas/paymentTerm'
// import createError from 'http-errors'
// const uuid = require('uuid/v4')

export default {
  all () {
    return db.any('SELECT * FROM payment_terms')
  }
}
