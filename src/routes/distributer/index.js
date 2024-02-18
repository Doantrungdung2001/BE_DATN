'use strict'

const express = require('express')
const distributerController = require('../../controllers/distributer.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

const router = express.Router()

router.get('/', asyncHandler(distributerController.getAllDistributers))
router.get('/:distributerId', asyncHandler(distributerController.getDistributerById))

module.exports = router
