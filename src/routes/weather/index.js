'use strict'

const express = require('express')
const weatherController = require('../../controllers/weather.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

const router = express.Router()

// Authentication
router.use(authenticationV2)
////////////
router.get('/', asyncHandler(weatherController.getWeatherDataByTime))

module.exports = router
