import express from 'express'
import bodyParser from 'body-parser'
import controllers from './controllers'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(controllers)
app.use((err, req, res, next) => {
  console.log(err)
  res.status(err.status || 500)
  return res.json('' + err)
})

app.listen(8081, () => {
  console.log('Server listening 8081')
})
