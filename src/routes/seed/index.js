'use strict'

const express = require('express')
const seedController = require('../../controllers/seed.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

const router = express.Router()

router.get('/search/:keySearch', asyncHandler(seedController.searchSeedByUser))
router.get('/farm/:farmId', asyncHandler(seedController.findAllSeeds))
router.get('/plant', asyncHandler(seedController.getSeedByPlantInFarm))
router.get('/:seedId', asyncHandler(seedController.findSeedBySeedId))

// Authentication
router.use(authenticationV2)
////////////
router.post('/', asyncHandler(seedController.addSeed))
router.patch('/:seedId', asyncHandler(seedController.updateSeed))
router.delete('/:seedId', asyncHandler(seedController.deleteSeed))

module.exports = router
