'use strict'

const { qr } = require('../qr.model')
const { Types } = require('mongoose')

const exportQR = async ({ projectId, outputId, distributerId, quantity }) => {
  // insert quantity qr document
  const qrData = []
  for (let i = 0; i < quantity; i++) {
    qrData.push({
      time: new Date(),
      isScanned: false,
      project: new Types.ObjectId(projectId),
      output: new Types.ObjectId(outputId),
      distributer: new Types.ObjectId(distributerId)
    })
  }
  return await qr.insertMany(qrData)
}

module.exports = {
  exportQR
}
