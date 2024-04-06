'use strict'

const ConnectionLossService = require('../services/connectionLoss.service')
const { SuccessResponse } = require('../core/success.response')

class ConnectionLossController {
  async getAllConnectionLossByCameraId(req, res, next) {
    new SuccessResponse({
      message: 'Get all connection losses by camera id success!',
      metadata: await ConnectionLossService.getAllConnectionLossByCameraId({
        cameraId: req.params.cameraId
      })
    }).send(res)
  }

  async getConnectionLossByCameraIdAndTime(req, res, next) {
    new SuccessResponse({
      message: 'Get connection losses by camera id and time success!',
      metadata: await ConnectionLossService.getConnectionLossByCameraIdAndTime({
        cameraId: req.params.cameraId,
        startTime: req.query.startTime,
        endTime: req.query.endTime
      })
    }).send(res)
  }

  async getConnectionLossByCameraIdAndDate(req, res, next) {
    new SuccessResponse({
      message: 'Get connection losses by camera id and date success!',
      metadata: await ConnectionLossService.getConnectionLossByCameraIdAndDate({
        cameraId: req.params.cameraId,
        date: req.query.date
      })
    }).send(res)
  }
}

module.exports = new ConnectionLossController()
