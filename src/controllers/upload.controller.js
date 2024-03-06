'use strict'

const { SuccessResponse } = require('../core/success.response')
const UploadService = require('../services/upload.service')
const { BadRequestError } = require('../core/error.response')

class UploadController {
  uploadFromUrl = async (req, res, next) => {
    new SuccessResponse({
      message: 'File uploaded successfully',
      metadata: await UploadService.uploadImageFromUrl(req.file)
    }).send(res)
  }

  uploadSingleImageFromLocal = async (req, res, next) => {
    const { file } = req
    if (!file) {
      throw new BadRequestError('Please upload a file')
    }
    console.log('file', file)
    new SuccessResponse({
      message: 'File uploaded successfully',
      metadata: await UploadService.uploadImageFromLocal({
        path: file.path,
        folderName: `image/${req.user.userId}`
      })
    }).send(res)
  }

  uploadImageFromLocalFiles = async (req, res, next) => {
    const { files } = req
    if (!files || files.length === 0) {
      throw new BadRequestError('Please upload a file')
    }
    new SuccessResponse({
      message: 'File uploaded successfully',
      metadata: await UploadService.uploadImageFromFromLocalFiles({
        files,
        folderName: `image/${req.user.userId}`
      })
    }).send(res)
  }
}

module.exports = new UploadController()
