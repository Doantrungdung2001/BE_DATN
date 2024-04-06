'use strict'

const express = require('express')
const connectionLossController = require('../../controllers/connectionLoss.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

const router = express.Router()

router.get('/camera/:cameraId/time', asyncHandler(connectionLossController.getConnectionLossByCameraIdAndTime))
router.get('/camera/:cameraId/date', asyncHandler(connectionLossController.getConnectionLossByCameraIdAndDate))
router.get('/camera/:cameraId', asyncHandler(connectionLossController.getAllConnectionLossByCameraId))

router.use(authenticationV2)

module.exports = router
