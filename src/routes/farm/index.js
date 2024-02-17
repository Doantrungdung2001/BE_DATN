'use strict'
const express = require('express')
const farmController = require('../../controllers/farm.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

const router = express.Router()

router.get('/:farmId', asyncHandler(farmController.getFarm))
// Authentication
router.use(authenticationV2)
//////////

router.patch('/', asyncHandler(farmController.updateFarm))

module.exports = router
