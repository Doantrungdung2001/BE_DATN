'use strict'

const ImageService = require('../services/image.service')
const { SuccessResponse } = require('../core/success.response')

class ImageController {
  async getAllImageByCameraId(req, res, next) {
    new SuccessResponse({
      message: 'Get all images by camera id success!',
      metadata: await ImageService.getAllImageByCameraId({
        cameraId: req.params.cameraId
      })
    }).send(res)
  }

  async getImageByCameraIdAndTime(req, res, next) {
    new SuccessResponse({
      message: 'Get images by camera id and time success!',
      metadata: await ImageService.getImageByCameraIdAndTime({
        cameraId: req.params.cameraId,
        startTime: req.query.startTime,
        endTime: req.query.endTime
      })
    }).send(res)
  }

  async getImageByCameraIdAndDate(req, res, next) {
    new SuccessResponse({
      message: 'Get images by camera id and date success!',
      metadata: await ImageService.getImageByCameraIdAndDate({
        cameraId: req.params.cameraId,
        date: req.query.date
      })
    }).send(res)
  }
}

module.exports = new ImageController()
