'use strict'

const express = require('express')
const router = express.Router()
const uploadController = require('../../controllers/upload.controller')

const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

const { uploadMemory, uploadDisk } = require('../../configs/multer.config')
router.use(authenticationV2)

router.post('/url', uploadController.uploadFromUrl)
router.post('/single', uploadDisk.single('file'), uploadController.uploadSingleImageFromLocal)
router.post('/multiple', uploadDisk.array('files', 10), uploadController.uploadImageFromLocalFiles)

module.exports = router
