import { Router } from 'express'
import { patients } from '../data/sampleData.js'

const router = Router()

router.get('/', (_request, response) => {
  response.json(patients)
})

export default router
