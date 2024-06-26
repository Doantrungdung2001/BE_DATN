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

  // get all Farms
  getAllFarms = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get all Farms success!',
      metadata: await FarmService.getAllFarms()
    }).send(res)
  }

  updateStatusFarm = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update status Farm success!',
      metadata: await FarmService.updateStatusFarm({ farmId: req.params.farmId, status: req.body.status })
    }).send(res)
  }

  searchFarms = async (req, res, next) => {
    new SuccessResponse({
      message: 'Search Farm success!',
      metadata: await FarmService.searchFarms(
        { 
          priceRange: req.body.priceRange, 
          squareRange: req.body.squareRange,
          plantNames: req.body.plantNames,
          district: req.body.district
       }
      )
    }).send(res)
  }

  deleteFarm = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete Farm success!',
      metadata: await FarmService.deleteFarm({ farmId: req.params.farmId })
    }).send(res)
  }
}

module.exports = new FarmController()
