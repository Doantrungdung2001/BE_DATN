const { Types } = require('mongoose')
const {
  getAllConnectionLossByCameraId,
  getConnectionLossByCameraIdAndTime,
  getConnectionLossByCameraIdAndDate
} = require('../models/repositories/connectionLoss.repo')
const { BadRequestError, MethodFailureError } = require('../core/error.response')
const { isValidObjectId } = require('../utils')

class ConnectionLossService {
  static async getAllConnectionLossByCameraId({ cameraId }) {
    if (!cameraId) throw new BadRequestError('CameraId is required')
    if (!isValidObjectId(cameraId)) throw new BadRequestError('CameraId is not valid')
    const connectionLosss = await getAllConnectionLossByCameraId({ cameraId })
    return connectionLosss
  }

  static async getConnectionLossByCameraIdAndTime({ cameraId, startTime, endTime }) {
    if (!cameraId) throw new BadRequestError('CameraId is required')
    if (!isValidObjectId(cameraId)) throw new BadRequestError('CameraId is not valid')
    if (!startTime) startTime = new Date(0)
    if (!endTime) endTime = new Date()
    const connectionLosss = await getConnectionLossByCameraIdAndTime({ cameraId, startTime, endTime })
    return connectionLosss
  }

  static async getConnectionLossByCameraIdAndDate({ cameraId, date }) {
    if (!cameraId) throw new BadRequestError('CameraId is required')
    if (!isValidObjectId(cameraId)) throw new BadRequestError('CameraId is not valid')
    if (!date) throw new BadRequestError('Date is required')
    const connectionLosss = await getConnectionLossByCameraIdAndDate({ cameraId, date })
    return connectionLosss
  }
}

module.exports = ConnectionLossService
