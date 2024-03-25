'use strict'

const express = require('express')
const clientController = require('../../controllers/client.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2, isAdmin } = require('../../auth/authUtils')

const router = express.Router()

router.use(authenticationV2)
router.get('/', isAdmin, asyncHandler(clientController.getAllClients))
router.get('/:clientId', asyncHandler(clientController.getClientById))

router.patch('/admin/:clientId', isAdmin, asyncHandler(clientController.updateClientByAdmin))
router.delete('/admin/:clientId', isAdmin, asyncHandler(clientController.deleteClient))
router.patch('/', asyncHandler(clientController.updateClient))

module.exports = router
