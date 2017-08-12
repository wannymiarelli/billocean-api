import express from 'express'
// middleware
import guardian from '../middlewares/guardian'
// Import all routes
import users from './users'
import customers from './customers'
import address from './address'
import progressive from './progressive'
import paymentTerms from './paymentTerms'
const router = express.Router()
/*
The guardian middleware watches all the API routes to protect
agains unahutorized access.
*/
router.use(guardian)

router.use('/users', users)
router.use('/api/customers', customers)
router.use('/api/address', address)
router.use('/api/payterms', paymentTerms)
router.use('/api/progressive', progressive)

export default router
