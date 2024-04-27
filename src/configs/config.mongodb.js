'use strict'

require('dotenv').config()
const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3052
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || 'shopDEV',
    user_name: process.env.DEV_DB_USERNAME || 'dung',
    password: process.env.DEV_DB_PASSWORD || '12345678',
    MONGO_URI: process.env.DEV_MONGO_URI
  }
}

const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 3052
  },
  db: {
    host: process.env.PRO_DB_HOST || 'localhost',
    port: process.env.PRO_DB_PORT || 27017,
    name: process.env.PRO_DB_NAME || 'shopDEV',
    user_name: process.env.PRO_DB_USERNAME || 'dung',
    password: process.env.PRO_DB_PASSWORD || '12345678',
    MONGO_URI: process.env.PRO_MONGO_URI
  }
}

const config = { dev, pro }
const env = process.env.NODE_ENV || 'dev'

module.exports = config[env]
