import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const SECRET = process.env.SECRET

const DB_LOG_LEVEL = process.env.DB_LOG_LEVEL
const CONSOLE_LOG_LEVEL = process.env.CONSOLE_LOG_LEVEL

export default { PORT, MONGODB_URI, SECRET, DB_LOG_LEVEL, CONSOLE_LOG_LEVEL }