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
}

module.exports = new DistributerController()
