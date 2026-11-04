import cors from 'cors'
import express from 'express'

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', message: 'CarePoint API is running' })
})

app.listen(port, () => {
  console.log(`CarePoint API listening on http://localhost:${port}`)
})
