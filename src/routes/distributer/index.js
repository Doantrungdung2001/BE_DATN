'use strict'

const express = require('express')
const distributerController = require('../../controllers/distributer.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2, isAdmin } = require('../../auth/authUtils')

const router = express.Router()

router.get('/', asyncHandler(distributerController.getAllDistributers))
router.get('/:distributerId', asyncHandler(distributerController.getDistributerById))

router.use(authenticationV2)
router.post('/', isAdmin, asyncHandler(distributerController.addDistributer))
router.patch('/:distributerId', isAdmin, asyncHandler(distributerController.updateDistributer))
router.delete('/:distributerId', isAdmin, asyncHandler(distributerController.deleteDistributer))

module.exports = router
