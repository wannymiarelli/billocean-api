import express from 'express'
import progressiveModel from '../models/progressive'
const router = express.Router()

router.get('/type/:type', (req, res, next) => {
  progressiveModel.findByType(req.params.type, req.user.id).then((progressive) => {
    return res.json(progressive)
  }).catch((error) => next(error))
})

router.post('/create', (req, res, next) => {
  progressiveModel.create(req.body, req.user.id).then((progressive) => {
    return res.json(progressive)
  }).catch((error) => next(error))
})

export default router
