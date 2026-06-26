import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '../generated/prisma/client.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing. Ensure .env exists beside server.js on the server.')
}

const adapter = new PrismaMariaDb(process.env.DATABASE_URL)
export const prisma = new PrismaClient({ adapter })
