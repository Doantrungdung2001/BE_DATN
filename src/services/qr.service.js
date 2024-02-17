const { Types } = require('mongoose')
const { exportQR } = require('../models/repositories/qr.repo')
const { BadRequestError } = require('../core/error.response')
const { isValidObjectId } = require('../utils')
const { getProjectInfo, updateOutput, updateExportQR } = require('./project.service')

class QRService {
  static async exportQR({ farmId, projectId, outputId, outputData }) {
    if (!projectId) {
      throw new BadRequestError('Project id is required')
    }
    if (!isValidObjectId(projectId)) {
      throw new BadRequestError('Invalid project id')
    }
    if (!outputId) {
      throw new BadRequestError('Output id is required')
    }
    if (!isValidObjectId(outputId)) {
      throw new BadRequestError('Invalid output id')
    }
    if (!outputData) {
      throw new BadRequestError('Output data is required')
    }

    // check if farm has permission to export QR
    if (!farmId) {
      throw new BadRequestError('Farm id is required')
    }
    if (!isValidObjectId(farmId)) {
      throw new BadRequestError('Invalid farm id')
    }
    // check if project exists
    const projectItem = await getProjectInfo({ projectId, select: 'farm' })
    if (!projectItem) {
      throw new BadRequestError('Project not found')
    }
    if (projectItem.farm._id.toString() !== farmId) {
      throw new BadRequestError('Farm does not have permission to export QR')
    }

    const { amount, amountPerOne, distributerWithAmount } = outputData
    if (!amountPerOne) {
      throw new BadRequestError('Amount per one is required')
    }
    // map in distributerWithAmount and validate distributerId and amount, then quantity = amount / amountPerOne, then call exportQR
    let quantity = 0
    await Promise.all(
      distributerWithAmount.map(async (item) => {
        if (!isValidObjectId(item.distributer)) {
          throw new BadRequestError('Invalid distributer id')
        }
        if (!item.amount) {
          throw new BadRequestError('Amount is required')
        }
        // quantity = amount / amountPerOne (base)
        quantity = item.amount / amountPerOne + 1
        await exportQR({ projectId, outputId, distributerId: item.distributer, quantity })
      })
    )

    await updateExportQR({ projectId, outputId })
    return true
  }
}

module.exports = QRService
