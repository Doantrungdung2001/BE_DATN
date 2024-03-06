'use strict'
const PlantFarmingService = require('../services/plantFarming.service')
const { SuccessResponse } = require('../core/success.response')
const { restart } = require('nodemon')
const { admin_id } = require('../constant')
class PlantFarmingController {
  // add PlantFarming
  addPlantFarming = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new PlantFarming success!',
      metadata: await PlantFarmingService.addPlantFarming({
        plantFarmingData: req.body,
        farmId: req.user.userId,
        plantId: req.body.plant,
        seedId: req.body.seed
      })
    }).send(res)
  }

  addPlantFarmingWithRecommendPlantIdAndSeedId = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new PlantFarming with recommend plantId and seedId success!',
      metadata: await PlantFarmingService.addPlantFarmingWithRecommendPlantIdAndSeedId({
        plantFarmingData: req.body,
        plantId: req.params.plantId,
        seedId: req.params.seedId,
        farmId: req.user.userId
      })
    }).send(res)
  }

  addPlantFarmingWithPlantIdAndSeedName = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new PlantFarming with plantId and seedName success!',
      metadata: await PlantFarmingService.addPlantFarmingWithPlantIdAndSeedName({
        plantFarmingData: req.body,
        plantId: req.params.plantId,
        seedName: req.params.seedName,
        farmId: req.user.userId
      })
    }).send(res)
  }

  // update PlantFarming
  updatePlantFarming = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update PlantFarming success!',
      metadata: await PlantFarmingService.updatePlantFarming({
        plantFarmingId: req.params.plantFarmingId,
        updatedData: req.body,
        farmId: req.user.userId
      })
    }).send(res)
  }

  // delete PlantFarming
  deletePlantFarming = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete PlantFarming success!',
      metadata: await PlantFarmingService.deletePlantFarming({
        plantFarmingId: req.params.plantFarmingId,
        farmId: req.user.userId
      })
    }).send(res)
  }

  // QUERY //

  getPlantFarmingByPlantFarmingId = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get plantFarming success!',
      metadata: await PlantFarmingService.getPlantFarmingByPlantFarmingId({ plantFarmingId: req.params.plantFarmingId })
    }).send(res)
  }

  getAllPlantFarmingByPlant = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get list plantFarming success!',
      metadata: await PlantFarmingService.getAllPlantFarmingByPlant({
        plantId: req.params.plantId,
        ...req.query
      })
    }).send(res)
  }

  getPlantFarmingBySeedId = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get plantFarming success!',
      metadata: await PlantFarmingService.getPlantFarmingBySeedId({ seedId: req.params.seedId })
    }).send(res)
  }

  getPlantFarmingRecommend = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get recommend plantFarming success!',
      metadata: await PlantFarmingService.getPlantFarmingRecommend({
        plantName: req.params.plantName,
        ...req.query,
        farmId: admin_id
      })
    }).send(res)
  }

  getPlantFarmingBySeedNameAndFarmId = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get plantFarming success!',
      metadata: await PlantFarmingService.getPlantFarmingBySeedNameAndFarmId({
        seedName: req.params.seedName,
        farmId: req.params.farmId
      })
    }).send(res)
  }
  // END QUERY //
}

module.exports = new PlantFarmingController()
