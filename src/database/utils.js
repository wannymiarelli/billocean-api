export default {
  getQueryParams (model) {
    let queryParams = {
      fields: [],
      placeholders: [],
      values: []
    }
    Object.keys(model).map((key, index) => {
      queryParams.fields.push(key)
      queryParams.placeholders.push(`$${index + 1}`)
      queryParams.values.push(model[key])
    })
    return queryParams
  },
  getUpdateQuery (fields, placeholders) {
    let query = []
    for (let i = 0; i < fields.length; i++) {
      if (!fields[i] === 'id' || fields[i].indexOf('_id') <= -1 || !fields[i] === 'tenant') {
        query.push(`${fields[i]} = ${placeholders[i]}`)
      }
    }
    return query.join(',')
  }
}
