'use strict'

const express = require('express')
const imageController = require('../../controllers/image.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

const router = express.Router()

router.get('/camera/:cameraId/time', asyncHandler(imageController.getImageByCameraIdAndTime))
router.get('/camera/:cameraId/date', asyncHandler(imageController.getImageByCameraIdAndDate))
router.get('/camera/:cameraId', asyncHandler(imageController.getAllImageByCameraId))

router.use(authenticationV2)

module.exports = router
