import promise from 'bluebird'
const pgp = require('pg-promise')({
  promiseLib: promise
})
const cn = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  database: 'billocean',
  password: '59929603'
}
// the db object
export default pgp(cn)
