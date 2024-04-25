require('dotenv').config()
const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const cors = require('cors')
const deleteUploads = require('./cron-tasks/delete-uploads')
const app = express()

// init moddlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(cors())
deleteUploads.start()

// init db
require('./dbs/init.mongodb')

// checkOverload()
// const { checkOverload } = require("./helpers/check.connect")

// init routes
app.use('/', require('./routes/'))

// handling error
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500
  console.log('error: ', error)
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error'
  })
})

module.exports = app
