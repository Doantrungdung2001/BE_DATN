'use strict'

const express = require('express')
const transferController = require('../../controllers/transfer.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2, isAdmin } = require('../../auth/authUtils')

const router = express.Router()

router.get('/', asyncHandler(transferController.getAllTransfers))
router.get('/:transferId', asyncHandler(transferController.getTransferById))
router.use(authenticationV2)
router.post('/', isAdmin, asyncHandler(transferController.addTransfer))
router.patch('/:transferId', isAdmin, asyncHandler(transferController.updateTransfer))
router.delete('/:transferId', isAdmin, asyncHandler(transferController.deleteTransfer))

module.exports = router
