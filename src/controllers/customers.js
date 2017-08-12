import express from 'express'
import customerModel from '../models/customer'
const router = express.Router()

router.get('/all', (req, res, next) => {
  customerModel.all(req.user.id).then((customers) => {
    return res.json(customers)
  }).catch((error) => next(error))
})

router.get('/id/:id', (req, res, next) => {
  customerModel.findById(req.params.id, req.user.id).then((customer) => {
    return res.json(customer.data)
  }).catch((error) => next(error))
})

router.get('/vat/:vat', (req, res, next) => {
  customerModel.findByVat(req.params.vat, req.user.id).then((customer) => {
    return res.json(customer)
  }).catch((error) => next(error))
})

router.get('/fiscal/:fiscal', (req, res, next) => {
  customerModel.findByFiscal(req.params.fiscal, req.user.id).then((customer) => {
    return res.json(customer)
  }).catch((error) => next(error))
})

router.post('/create', (req, res, next) => {
  customerModel.create(req.body, req.user.id).then((customer) => {
    return res.json(customer)
  }).catch((error) => next(error))
})

router.post('/update/:id', (req, res, next) => {
  customerModel.update(req.body, req.user.id).then((customer) => {
    return res.json(customer)
  }).catch((error) => next(error))
})

export default router
