export default {
  notFound (type) {
    let error = new Error(`${type} not found`)
    error.status = 404
    error.message = '404 - Resource not found on the server'
    return error
  },
  noAuth () {
    let error = new Error(`Not permitted - you need to log in`)
    error.status = 401
    error.message = '401 -  Not authenticated'
    return error
  },
  notValidInstance (validation) {
    let error = new Error(validation.details[0].message)
    error.status = 400
    error.message = validation
    return error
  }
}
