'use strict'

const express = require('express')
const plantFarmingController = require('../../controllers/plantFarming.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

const router = express.Router()

router.get('/farm/:seedName/:farmId', asyncHandler(plantFarmingController.getPlantFarmingBySeedNameAndFarmId))
router.get('/recommend/:plantName', asyncHandler(plantFarmingController.getPlantFarmingRecommend))
router.get('/plant/:plantId', asyncHandler(plantFarmingController.getAllPlantFarmingByPlant))
router.get('/seed/:seedId', asyncHandler(plantFarmingController.getPlantFarmingBySeedId))
router.get('/:plantFarmingId', asyncHandler(plantFarmingController.getPlantFarmingByPlantFarmingId))

// Authentication
router.use(authenticationV2)
////////////
router.post('/add/:plantId/:seedId', asyncHandler(plantFarmingController.addPlantFarmingWithRecommendPlantIdAndSeedId))
router.post(
  '/addPlantFarmingWithPlantIdAndSeedName/:plantId/:seedName',
  asyncHandler(plantFarmingController.addPlantFarmingWithPlantIdAndSeedName)
)
router.post('/', asyncHandler(plantFarmingController.addPlantFarming))
router.patch('/:plantFarmingId', asyncHandler(plantFarmingController.updatePlantFarming))
router.delete('/:plantFarmingId', asyncHandler(plantFarmingController.deletePlantFarming))

module.exports = router
