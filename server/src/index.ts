import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import playerRoutes from './routes/players'
import matchRoutes from './routes/matches'
import rankingRoutes from './routes/rankings'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 路由
app.use('/api/players', playerRoutes)
app.use('/api/matches', matchRoutes)
app.use('/api/rankings', rankingRoutes)

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 错误处理
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// 404处理
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})