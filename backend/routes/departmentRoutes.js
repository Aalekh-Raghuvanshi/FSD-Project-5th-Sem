import { Router } from 'express'
import { departments } from '../data/sampleData.js'

const router = Router()

router.get('/', (_request, response) => {
  response.json(departments)
})

export default router
