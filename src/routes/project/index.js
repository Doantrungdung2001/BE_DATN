'use strict'

const express = require('express')
const projectController = require('../../controllers/project.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

const router = express.Router()

router.get('/:projectId/plantFarming', asyncHandler(projectController.getPlantFarming))
router.get(
  '/:projectId/processesWithObjectDetections',
  asyncHandler(projectController.getProcessesWithObjectDetections)
)
router.get('/:projectId/process', asyncHandler(projectController.getAllProcess))
router.get('/:projectId/camera', asyncHandler(projectController.getCameraInProject))
router.get('/:projectId', asyncHandler(projectController.getProjectInfo))

// Authentication
router.use(authenticationV2)
////////////

router.post('/:projectId/plantFarming', asyncHandler(projectController.addPlantFarmingToProject))
router.post('/:projectId/process', asyncHandler(projectController.addProcess))
router.patch('/:projectId/process/:processId', asyncHandler(projectController.updateProcess))
router.delete('/:projectId/process/:processId', asyncHandler(projectController.deleteProcess))
router.post('/', asyncHandler(projectController.initProject))
router.patch('/:projectId', asyncHandler(projectController.updateProjectInfo))
router.delete('/:projectId', asyncHandler(projectController.deleteProject))
router.patch('/:projectId/camera', asyncHandler(projectController.updateCameraToProject))

module.exports = router
