'use strict'
const FarmService = require('../services/farm.service')
const { SuccessResponse } = require('../core/success.response')

class FarmController {
  // get Farm
  getFarm = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Farm success!',
      metadata: await FarmService.getFarm({ farmId: req.params.farmId })
    }).send(res)
  }

  // update Farm
  updateFarm = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Farm success!',
      metadata: await FarmService.updateInfoFarm({ farmId: req.user.userId, farm: req.body })
    }).send(res)
  }
}

module.exports = new FarmController()
