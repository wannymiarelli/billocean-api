import express from 'express'
import paymentTerm from '../models/paymentTerm'
const router = express.Router()

router.get('/all', (req, res, next) => {
  paymentTerm.all(req.user.id).then((paymentTerms) => {
    return res.json(paymentTerms)
  }).catch((error) => next(error))
})

export default router
