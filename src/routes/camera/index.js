'use strict'
const express = require('express')
const cameraController = require('../../controllers/camera.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2, isAdmin } = require('../../auth/authUtils')

const router = express.Router()

router.get('/farm/:farmId', asyncHandler(cameraController.getCamerasInFarm))
router.get('/:cameraId', asyncHandler(cameraController.getCameraById))
// Authentication
router.use(authenticationV2)
//////////

router.post('/', asyncHandler(cameraController.addCamera))
router.patch('/:cameraId', asyncHandler(cameraController.updateCamera))
router.delete('/:cameraId', asyncHandler(cameraController.deleteCamera))

module.exports = router
