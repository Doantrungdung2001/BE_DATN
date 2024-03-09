const { Types } = require('mongoose')
const { exportQR, scanQR, getQRById } = require('../models/repositories/qr.repo')
const { BadRequestError } = require('../core/error.response')
const { isValidObjectId } = require('../utils')
const { getProjectInfo, updateExportQR } = require('./project.service')
const { ThirdwebSDK } = require('@thirdweb-dev/sdk')
const { getClientById } = require('./client.service')

class QRService {
  static async exportQR({ farmId, projectId, outputId, outputData, privateIds, txExport }) {
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

    if (!privateIds) {
      throw new BadRequestError('Private ids are required')
    }

    // check if privateIds is array
    if (!Array.isArray(privateIds)) {
      throw new BadRequestError('Private ids must be an array')
    }

    if (!txExport) {
      throw new BadRequestError('Tx export is required')
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

    // check if total numberOfQR in each distributer is equal to numberOfQR
    let totalNumberOfQR = 0
    distributerWithAmount.forEach((item) => {
      totalNumberOfQR += item.numberOfQR
    })

    if (totalNumberOfQR !== privateIds.length) {
      throw new BadRequestError('Total number of QR in each distributer must be equal to the length of private ids')
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
        quantity = item.numberOfQR
        await exportQR({ projectId, outputId, distributerId: item.distributer, quantity, txExport })
      })
    )

    await updateExportQR({ projectId, outputId })
    return true
  }

  static async scanQR({ qrId, clientId }) {
    if (!qrId) {
      throw new BadRequestError('QR id is required')
    }
    if (!isValidObjectId(qrId)) {
      throw new BadRequestError('Invalid QR id')
    }
    if (!clientId) {
      throw new BadRequestError('Client id is required')
    }
    if (!isValidObjectId(clientId)) {
      throw new BadRequestError('Invalid client id')
    }

    const clientItem = await getClientById({ clientId })
    if (!clientItem) {
      throw new BadRequestError('Client not found')
    }

    // check if qr exists
    const qrItem = await getQRById(qrId)
    if (!qrItem) {
      throw new BadRequestError('QR not found')
    }

    const purchaseInfo = `${
      clientItem.name
    } with id ${clientItem._id.toString()} bought this product from distributer: ${qrItem.distributer.name}, farm: ${
      qrItem.project.farm.name
    } at ${new Date()}`

    const sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, 'evmos', {
      secretKey: process.env.THIRDWEB_SECRET_KEY
    })

    // Connect to your smart contract using the contract address
    const contract = await sdk.getContract(process.env.QR_CONTRACT_ADDRESS)

    const result = await contract.call('purchaseProduct', [
      qrItem.project._id.toString(),
      qrItem.privateId,
      purchaseInfo
    ])
    console.log('Executed transaction:', result.receipt.transationHash)
    const txScan = result.receipt.transationHash

    // update output
    const scanQRItem = await scanQR({ qrId, txScan, clientId })
    if (!scanQRItem) {
      throw new BadRequestError('Scan QR failed')
    }

    return true
  }
}

module.exports = QRService
