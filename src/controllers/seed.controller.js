'use strict'
const SeedService = require('../services/seed.service')
const { SuccessResponse } = require('../core/success.response')
const { restart } = require('nodemon')
const { admin_id } = require('../constant')
class SeedController {
  // add Seed
  addSeed = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Seed success!',
      metadata: await SeedService.addSeed({ seedData: req.body, farmId: req.user.userId, plantId: req.body.plantId })
    }).send(res)
  }
  // add Seed by recomment seedId
  addSeedByRecommentSeedId = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Seed by recomment seedId success!',
      metadata: await SeedService.addSeedByRecommentSeedId({
        recommentSeedId: req.params.recommentSeedId,
        farmId: req.user.userId
      })
    }).send(res)
  }

  // update Seed
  updateSeed = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Seed success!',
      metadata: await SeedService.updateSeed({
        seedId: req.params.seedId,
        seedData: req.body,
        farmId: req.user.userId
      })
    }).send(res)
  }

  // update isSeedDefault
  updateSeedDefault = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Seed success!',
      metadata: await SeedService.updateSeedDefault({
        seedId: req.params.seedId,
        farmId: req.user.userId
      })
    }).send(res)
  }

  // delete Seed
  deleteSeed = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete Seed success!',
      metadata: await SeedService.deleteSeed({ seedId: req.params.seedId, farmId: req.user.userId })
    }).send(res)
  }

  // QUERY //

  searchSeedByUser = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get list getListSearchSeed success!',
      metadata: await SeedService.searchSeedByUser(req.params)
    }).send(res)
  }

  getAllSeedsByFarm = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get list getAllSeedsByFarm success!',
      metadata: await SeedService.getAllSeedsByFarm({ farmId: req.params.farmId, ...req.query })
    }).send(res)
  }

  getSeedBySeedId = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get seed success!',
      metadata: await SeedService.getSeedBySeedId({ seedId: req.params.seedId })
    }).send(res)
  }

  getSeedByPlantInFarm = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get seed success!',
      metadata: await SeedService.getSeedByPlantInFarm({
        plantName: req.query.plantName,
        plantId: req.query.plantId,
        farmId: req.query.farmId
      })
    }).send(res)
  }

  getRecommendSeedByPlant = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get seed success!',
      metadata: await SeedService.getSeedByPlantInFarm({
        plantName: req.params.plantName,
        farmId: admin_id
      })
    }).send(res)
  }
  // END QUERY //
}

module.exports = new SeedController()
