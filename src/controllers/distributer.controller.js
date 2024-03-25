'use strict'

const DistributerService = require('../services/distributer.service')
const { SuccessResponse } = require('../core/success.response')

class DistributerController {
  getAllDistributers = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get all distributers success!',
      metadata: await DistributerService.getAllDistributers({
        ...req.query
      })
    }).send(res)
  }

  getDistributerById = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get distributer by id success!',
      metadata: await DistributerService.getDistributerById({
        distributerId: req.params.distributerId
      })
    }).send(res)
  }

  addDistributer = async (req, res, next) => {
    new SuccessResponse({
      message: 'Add distributer success!',
      metadata: await DistributerService.addDistributer({
        distributerData: req.body
      })
    }).send(res)
  }

  updateDistributer = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update distributer success!',
      metadata: await DistributerService.updateDistributer({
        distributerId: req.params.distributerId,
        distributerData: req.body
      })
    }).send(res)
  }

  deleteDistributer = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete distributer success!',
      metadata: await DistributerService.deleteDistributer({
        distributerId: req.params.distributerId
      })
    }).send(res)
  }
}

module.exports = new DistributerController()
