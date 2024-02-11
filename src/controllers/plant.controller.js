'use strict'
const PlantService = require('../services/plant.service')
const { SuccessResponse } = require('../core/success.response')
const { restart } = require('nodemon')
const { admin_id } = require('../constant')
class PlantController {
  // add Plant
  addPlant = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Plant success!',
      metadata: await PlantService.addPlant({ plantData: req.body, farmId: req.user.userId })
    }).send(res)
  }

  // add Plant by recomment plantId
  addPlantByRecommentPlantId = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Plant by recomment plantId success!',
      metadata: await PlantService.addPlantByRecommentPlantId({
        recommentPlantId: req.params.recommentPlantId,
        farmId: req.user.userId
      })
    }).send(res)
  }

  // update Plant
  updatePlant = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Plant success!',
      metadata: await PlantService.updatePlant({
        plantId: req.params.plantId,
        plantData: req.body,
        farmId: req.user.userId
      })
    }).send(res)
  }

  // delete Plant
  deletePlant = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete Plant success!',
      metadata: await PlantService.deletePlant({ plantId: req.params.plantId, farmId: req.user.userId })
    }).send(res)
  }

  // QUERY //

  searchPlantByUser = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get list getListSearchPlant success!',
      metadata: await PlantService.searchPlantByUser(req.params)
    }).send(res)
  }

  getAllPlantsByFarm = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get list getAllPlantsByFarm success!',
      metadata: await PlantService.getAllPlantsByFarm({ farmId: req.params.farmId, ...req.query })
    }).send(res)
  }

  getPlantByPlantId = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get plant success!',
      metadata: await PlantService.getPlantByPlantId({ plantId: req.params.plantId })
    }).send(res)
  }

  getRecommendPlant = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get list getRecommendPlant success!',
      metadata: await PlantService.getAllPlantsByFarm({ farmId: admin_id, ...req.query })
    }).send(res)
  }

  getDefaultPlantByPlantId = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get default plant success!',
      metadata: await PlantService.getDefaultPlantByPlantId({ plantId: req.params.plantId, farmId: admin_id })
    }).send(res)
  }
  // END QUERY //
}

module.exports = new PlantController()
