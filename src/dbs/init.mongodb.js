'use strict'

const mongoose = require('mongoose')
const {
  db: { host, name, port, user_name, password, MONGO_URI }
} = require('../configs/config.mongodb')
const connectString = MONGO_URI || `mongodb://${user_name}:${password}@${host}:${port}/${name}`

class Database {
  constructor() {
    this.connect()
  }

  connect(type = 'mongo') {
    if (1 === 1) {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
      mongoose.set('strictQuery', false)
    }
    mongoose
      .connect(connectString, {
        maxPoolSize: 100
      })
      .then((_) => console.log('Connected mongodb success'))
      .catch((err) => console.log('Error connect', err))
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }

    return Database.instance
  }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb
