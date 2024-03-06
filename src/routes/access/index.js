'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()

// signUp
router.post('/signup', asyncHandler(accessController.signUp))
router.post('/login', asyncHandler(accessController.login))
router.post('/forgotPassword', asyncHandler(accessController.forgotPassword))
router.post('/resetPassword', asyncHandler(accessController.resetPassword))

router.get('/testSendEmail', asyncHandler(accessController.testSendEmail))

// Authentication
router.use(authenticationV2)

router.get('/farm/test', asyncHandler(accessController.test))
router.get('/access/me', asyncHandler(accessController.getUser))
////////////
router.post('/logout', asyncHandler(accessController.logout))
router.patch('/updatePassword', asyncHandler(accessController.updatePassword))
router.post('/access/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken))

module.exports = router
