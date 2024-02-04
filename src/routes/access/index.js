'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()

// signUp
router.post('/signup', asyncHandler(accessController.signUp))
router.post('/login', asyncHandler(accessController.login))

// Authentication
router.use(authenticationV2)

router.get('/farm/test', asyncHandler(accessController.test))
router.get('/farm/me', asyncHandler(accessController.getFarm))
////////////
router.post('/farm/logout', asyncHandler(accessController.logout))
router.post('/farm/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken))

module.exports = router
