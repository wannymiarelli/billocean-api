import express from 'express'
import errors from '../common/errors'
import jwt from 'jsonwebtoken'
const router = express.Router()

router.use('/api/**', (req, res, next) => {
  // check if there is a access-token header
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    // verify the given token
    jwt.verify(req.headers.authorization.split(' ')[1], 'secret!bioceanéé**ààòò', (err, decoded) => {
      if (err || typeof decoded === 'undefined') {
        req.user = undefined
        return next(errors.noAuth())
      }
      req.user = decoded
      next()
    })
  } else {
    return next(errors.noAuth())
  }
})

export default router
