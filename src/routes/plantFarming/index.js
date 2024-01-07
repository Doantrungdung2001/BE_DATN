'use strict'

const express = require('express')
const plantFarmingController = require('../../controllers/plantFarming.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

const router = express.Router()

router.get('/plant/:plantId', asyncHandler(plantFarmingController.getAllPlantFarmingByPlant))
router.get('/:plantFarmingId', asyncHandler(plantFarmingController.getPlantFarmingByPlantFarmingId))

// Authentication
router.use(authenticationV2)
////////////
router.post('/', asyncHandler(plantFarmingController.addPlantFarming))
router.patch('/:plantFarmingId', asyncHandler(plantFarmingController.updatePlantFarming))
router.delete('/:plantFarmingId', asyncHandler(plantFarmingController.deletePlantFarming))

module.exports = router
