import { Router } from 'express'
import { appointments } from '../data/sampleData.js'

const router = Router()

router.get('/', (_request, response) => {
  response.json(appointments)
})

export default router
