import dotenv from 'dotenv'
dotenv.config()

const {
  PORT,
  DATABASE_URL,
  SECRET
} = process.env

const config = {
  PORT,
  DATABASE_URL: String(DATABASE_URL),
  SECRET: String(SECRET)
}

export default config
