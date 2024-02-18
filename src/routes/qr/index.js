'use strict'

const express = require('express')
const qrController = require('../../controllers/qr.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

const router = express.Router()

// Authentication
router.use(authenticationV2)
////////////

router.post('/export/:projectId/:outputId', asyncHandler(qrController.exportQR))

module.exports = router
