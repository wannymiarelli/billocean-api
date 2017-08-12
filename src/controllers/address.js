import express from 'express'
import addressModel from '../models/address'
const router = express.Router()

router.post('/create', (req, res, next) => {
  addressModel.create({...req.body, tenant: req.user.id}).then((address) => {
    return res.json(address)
  }).catch((error) => next(error))
})

export default router
