import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import cors from 'cors'

import authRouter from './routes/auth.route.js'
import interviewRouter from './routes/interview.route.js'

dotenv.config()

const app = express()

// Parse JSON
app.use(express.json())

// Read cookies
app.use(cookieParser())

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URI,
    credentials: true
}))

// Routes
app.use('/api/auth', authRouter)
app.use('/api/interview', interviewRouter)

export default app