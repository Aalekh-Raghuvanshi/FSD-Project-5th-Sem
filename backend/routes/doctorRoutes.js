import { Router } from 'express'
import { doctors } from '../data/sampleData.js'

const router = Router()

router.get('/', (_request, response) => {
  response.json(doctors)
})

export default router
