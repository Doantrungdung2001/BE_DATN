'use strict'
const QRService = require('../services/qr.service')
const { SuccessResponse } = require('../core/success.response')

class QRController {
  // export QR
  exportQR = async (req, res, next) => {
    new SuccessResponse({
      message: 'Export QR success!',
      metadata: await QRService.exportQR({
        projectId: req.params.projectId,
        outputId: req.params.outputId,
        outputData: req.body,
        farmId: req.user.userId
      })
    }).send(res)
  }
}

module.exports = new QRController()
