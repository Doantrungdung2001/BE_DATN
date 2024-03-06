const express = require('express')
const hashController = require('../../controllers/hash.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

const router = express.Router()

router.post('/', asyncHandler(hashController.hashImages))

module.exports = router
