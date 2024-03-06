'use strict'

const express = require('express')
const seedController = require('../../controllers/seed.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

const router = express.Router()

router.get('/search/:keySearch', asyncHandler(seedController.searchSeedByUser))
router.get('/farm/:farmId', asyncHandler(seedController.getAllSeedsByFarm))
router.get('/plant', asyncHandler(seedController.getSeedByPlantInFarm))
router.get('/recommendFromPlant/:plantName', asyncHandler(seedController.getRecommendSeedByPlant))
router.get('/:seedId', asyncHandler(seedController.getSeedBySeedId))

// Authentication
router.use(authenticationV2)
////////////
router.post('/add/:recommentSeedId', asyncHandler(seedController.addSeedByRecommentSeedId))
router.post('/', asyncHandler(seedController.addSeed))
router.patch('/:seedId', asyncHandler(seedController.updateSeed))
router.patch('/default/:seedId', asyncHandler(seedController.updateSeedDefault))
router.delete('/:seedId', asyncHandler(seedController.deleteSeed))

module.exports = router
