import express from 'express'
import userModel from '../models/user'
const router = express.Router()

router.get('/all', (req, res) => {
  return res.json('all users')
})

router.post('/create', (req, res, next) => {
  userModel.create(req.body).then((user) => {
    return res.json(user)
  }, (error) => next(error))
})

router.post('/login', (req, res, next) => {
  userModel.authenticate(req.body.email, req.body.password).then((token) => {
    return res.json(token)
  }).catch((error) => next(error))
})

export default router
