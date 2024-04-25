'use strict'
const ProjectService = require('../services/project.service')
const { SuccessResponse } = require('../core/success.response')
const { restart } = require('nodemon')
const { admin_id } = require('../constant')
class ProjectController {
  // init Project
  initProject = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Project success!',
      metadata: await ProjectService.initProject({
        project: req.body,
        farmId: req.user.userId,
        status: 'inProgress',
        startDate: new Date()
      })
    }).send(res)
  }

  // update Project
  updateProjectInfo = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Project success!',
      metadata: await ProjectService.updateProjectInfo({
        projectId: req.params.projectId,
        updatedFields: req.body
      })
    }).send(res)
  }

  // delete Project
  deleteProject = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete Project success!',
      metadata: await ProjectService.deleteProject({
        projectId: req.params.projectId,
        farmId: req.user.userId
      })
    }).send(res)
  }

  // add PlantFarming
  addPlantFarmingToProject = async (req, res, next) => {
    new SuccessResponse({
      message: 'Add PlantFarming success!',
      metadata: await ProjectService.addPlantFarmingToProject({
        projectId: req.params.projectId,
        plantFarming: req.body,
        farmId: req.user.userId
      })
    }).send(res)
  }

  // add Process
  addProcess = async (req, res, next) => {
    new SuccessResponse({
      message: 'Add Process success!',
      metadata: await ProjectService.addProcess({
        projectId: req.params.projectId,
        process: req.body
      })
    }).send(res)
  }

  // update Process
  updateProcess = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Process success!',
      metadata: await ProjectService.updateProcess({
        projectId: req.params.projectId,
        processId: req.params.processId,
        process: req.body
      })
    }).send(res)
  }

  // delete Process
  deleteProcess = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete Process success!',
      metadata: await ProjectService.deleteProcess({
        projectId: req.params.projectId,
        processId: req.params.processId
      })
    }).send(res)
  }

  // QUERY //

  getProjectInfo = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get project success!',
      metadata: await ProjectService.getProjectInfo({ projectId: req.params.projectId })
    }).send(res)
  }

  getAllProcess = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get list getAllProcess success!',
      metadata: await ProjectService.getAllProcess({ projectId: req.params.projectId })
    }).send(res)
  }

  getPlantFarming = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get PlantFarming success!',
      metadata: await ProjectService.getPlantFarming({ projectId: req.params.projectId })
    }).send(res)
  }

  getProcessesWithObjectDetections = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get ProcessesWithObjectDetections success!',
      metadata: await ProjectService.getProcessWithObjectDetection({ projectId: req.params.projectId })
    }).send(res)
  }
  // END QUERY //
}

module.exports = new ProjectController()
