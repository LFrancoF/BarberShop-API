import {createPool} from 'mysql2/promise'
import {config} from 'dotenv'

config()

export const pool = createPool({
    host: process.env.DB_HOST || 'localhost', 
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_DATABASE || 'classic_barbershop'
})

