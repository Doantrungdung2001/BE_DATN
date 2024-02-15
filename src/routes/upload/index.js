'use strict'

const express = require('express')
const router = express.Router()
const uploadController = require('../../controllers/upload.controller')

const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

const { uploadMemory, uploadDisk } = require('../../configs/multer.config')

router.post('/product', uploadController.uploadFromUrl)
router.post('/product/thumb', uploadDisk.single('file'), uploadController.uploadThumb)
router.post('/product/images', uploadDisk.array('files', 10), uploadController.uploadImageFromLocalFiles)

module.exports = router
