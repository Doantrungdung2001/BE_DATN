'use strict'

const express = require('express')
const plantController = require('../../controllers/plant.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

const router = express.Router()

router.get('/search/:keySearch', asyncHandler(plantController.searchPlantByUser))
router.get('/farm/:farmId', asyncHandler(plantController.getAllPlantsByFarm))
router.get('/recommend', asyncHandler(plantController.getRecommendPlant))
router.get('/default/:plantId', asyncHandler(plantController.getDefaultPlantByPlantId))
router.get('/:plantId', asyncHandler(plantController.getPlantByPlantId))

// Authentication
router.use(authenticationV2)
////////////
router.post('/add/:recommentPlantId', asyncHandler(plantController.addPlantByRecommentPlantId))
router.post('/', asyncHandler(plantController.addPlant))
router.patch('/:plantId', asyncHandler(plantController.updatePlant))
router.delete('/:plantId', asyncHandler(plantController.deletePlant))

module.exports = router
