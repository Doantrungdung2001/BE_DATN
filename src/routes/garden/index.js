'use strict'

const express = require('express')
const gardenController = require('../../controllers/garden.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

const router = express.Router()

router.get('/farm/:farmId', asyncHandler(gardenController.getAllGardensByFarm))
router.get('/:gardenId', asyncHandler(gardenController.getGardenById))
router.get('/:gardenId/projects', asyncHandler(gardenController.getProjectsInfoByGarden))
router.get('/:gardenId/projects/:projectId', asyncHandler(gardenController.getProjectPlantFarmingByGarden))
router.get('/:gardenId/process/:projectId', asyncHandler(gardenController.getProjectProcessByGarden))
router.get('/:gardenId/requests', asyncHandler(gardenController.getClientRequestsByGarden))

// Authentication
router.use(authenticationV2)
////////////
router.post('/', asyncHandler(gardenController.createGarden))
router.patch('/:gardenId', asyncHandler(gardenController.updateGardenStatus))

router.post('/:gardenId/delivery', asyncHandler(gardenController.addDelivery))
router.patch('/:gardenId/delivery/:deliveryId', asyncHandler(gardenController.updateDelivery))
router.delete('/:gardenId/delivery/:deliveryId', asyncHandler(gardenController.deleteDelivery))

router.post('/:gardenId/request', asyncHandler(gardenController.addClientRequest))
router.patch('/:gardenId/request/:clientRequestId', asyncHandler(gardenController.updateClientRequest))
router.delete('/:gardenId/request/:clientRequestId', asyncHandler(gardenController.deleteClientRequest))

module.exports = router
