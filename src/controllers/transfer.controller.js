'use strict'
const TransferService = require('../services/transfer.service')
const { SuccessResponse } = require('../core/success.response')

class TransferController {
  // add Transfer
  addTransfer = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Transfer success!',
      metadata: await TransferService.addTransfer({ data: req.body })
    }).send(res)
  }

  // update Transfer
  updateTransfer = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Transfer success!',
      metadata: await TransferService.updateTransfer({
        transferId: req.params.transferId,
        data: req.body
      })
    }).send(res)
  }

  // delete Transfer
  deleteTransfer = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete Transfer success!',
      metadata: await TransferService.deleteTransfer({ transferId: req.params.transferId })
    }).send(res)
  }

  // QUERY //

  getTransferById = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get Transfer by id success!',
      metadata: await TransferService.getTransferById({
        transferId: req.params.transferId
      })
    }).send(res)
  }

  getAllTransfers = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get all Transfers success!',
      metadata: await TransferService.getAllTransfers({
        ...req.query
      })
    }).send(res)
  }
}

module.exports = new TransferController()
