const { Types } = require('mongoose')
const {
  initProject,
  getProjectInfo,
  updateProjectInfo,
  deleteProject,
  addPlantFarmingToProject,
  getAllProcess,
  addProcess,
  updateProcess,
  deleteProcess,
  getPlantFarmingId
} = require('../models/repositories/project.repo')
const {
  addPlantFarming,
  getPlantFarmingByPlantFarmingId,
  deletePlantFarming,
  checkPlantFarmingExist
} = require('../services/plantFarming.service')
const { updateNestedObjectParser, removeUndefinedObject, isValidObjectId } = require('../utils')
const { BadRequestError, MethodFailureError, NotFoundError } = require('../core/error.response')

class ProjectService {
  static async initProject({ farmId, project, status, startDate }) {
    if (!farmId) throw new BadRequestError('Missing farm id')
    if (!isValidObjectId(farmId)) throw new BadRequestError('Invalid farm id')
    if (!project) throw new BadRequestError('Missing project')

    const { plant, seed, farm, ...newProject } = project
    const { plantId, seedId } = newProject
    if (!plantId) throw new BadRequestError('Missing plant id')
    if (!seedId) throw new BadRequestError('Missing seed id')

    const updatedProject = await initProject({
      farmId,
      plantId,
      seedId,
      projectData: {
        ...newProject,
        createdAtTime: new Date(),
        startDate
      },
      status
    })
    if (!updatedProject) throw new MethodFailureError('Cannot init project')
    return updatedProject
  }

  static async getProjectInfo({ projectId }) {
    if (!projectId) throw new BadRequestError('Missing project id')
    if (!isValidObjectId(projectId)) throw new BadRequestError('Invalid project id')
    const project = await getProjectInfo({
      projectId,
      select: [
        'plant',
        'seed',
        'farm',
        'startDate',
        'status',
        'createdAtTime',
        'plantFarming',
        'historyInfo',
        'isInfoEdited',
        'createdAt',
        'updatedAt'
      ]
    })
    if (!project) throw new NotFoundError('Project not found')
    return project
  }

  static async updateProjectInfo({ projectId, updatedFields }) {
    if (!projectId) throw new BadRequestError('Missing project id')
    if (!isValidObjectId(projectId)) throw new BadRequestError('Invalid project id')
    if (!updatedFields) throw new BadRequestError('Missing updated fields')

    const { seed, startDate, status } = updatedFields
    if (seed && !isValidObjectId(seed)) throw new BadRequestError('Invalid seed id')
    const projectUpdate = removeUndefinedObject({
      seed,
      startDate,
      status,
      createdAtTime: new Date()
    })
    const projectInfo = await getProjectInfo({ projectId })
    const historyInfoItem = {
      createdAtTime: projectInfo.createdAtTime ? projectInfo.createdAtTime : projectInfo.createdAt,
      seed: projectInfo.seed,
      startDate: projectInfo.startDate,
      modifiedAt: new Date()
    }
    const updatedProject = await updateProjectInfo({
      projectId,
      projectData: projectUpdate,
      historyInfoItem: historyInfoItem
    })
    if (!updatedProject) throw new MethodFailureError('Cannot update project')
    return updatedProject
  }

  static async deleteProject({ projectId, farmId }) {
    if (!projectId) throw new BadRequestError('Missing project id')
    if (!isValidObjectId(projectId)) throw new BadRequestError('Invalid project id')
    // find farm of project and check if it is the same farm
    const projectInfo = await getProjectInfo({ projectId })
    if (!projectInfo)
      return {
        message: 'Project not found'
      }
    if (projectInfo.farm._id.toString() !== farmId)
      throw new BadRequestError('Do not have permission to delete this project')
    const plantFarmingId = await getPlantFarmingId({ projectId })
    const isPlantFarmingExist = await checkPlantFarmingExist({ plantFarmingId })

    if (plantFarmingId && isPlantFarmingExist) {
      const deletedPlantFarming = await deletePlantFarming({ plantFarmingId, farmId })
      if (!deletedPlantFarming) throw new MethodFailureError('Cannot delete plant farming of this project')
    }
    const updatedProject = await deleteProject({ projectId })
    if (!updatedProject) throw new MethodFailureError('Cannot delete project')
    return updatedProject
  }

  static async addPlantFarmingToProject({ projectId, plantFarming, farmId }) {
    if (!projectId) throw new BadRequestError('Missing project id')
    if (!plantFarming) throw new BadRequestError('Missing plant farming')

    const projectInfo = await getProjectInfo({ projectId })

    const plantId = projectInfo.plant._id.toString()
    const seedId = projectInfo.seed._id.toString()
    const addedPlantFarming = await addPlantFarming({
      plantFarmingData: {
        ...plantFarming,
        isPlantFarmingDefault: false
      },
      farmId: farmId,
      plantId,
      seedId
    })
    if (!addedPlantFarming) throw new MethodFailureError('Cannot add plant farming')
    const updatedProject = await addPlantFarmingToProject({
      projectId,
      plantFarmingId: addedPlantFarming._id.toString()
    })
    if (!updatedProject) throw new MethodFailureError('Cannot add plant farming')
    return updatedProject
  }

  static async getAllProcess({ projectId }) {
    if (!projectId) throw new BadRequestError('Missing project id')
    if (!isValidObjectId(projectId)) throw new BadRequestError('Invalid project id')
    const processes = await getAllProcess({ projectId })
    return processes
  }

  static async addProcess({ projectId, process }) {
    if (!projectId) throw new BadRequestError('Missing project id')
    if (!isValidObjectId(projectId)) throw new BadRequestError('Invalid project id')
    if (!process) throw new BadRequestError('Missing process')

    const { time, type, ...activity } = process

    if (!time || !type) throw new BadRequestError('Missing required fields')

    let activityField
    switch (type) {
      case 'cultivation':
        activityField = 'cultivationActivity'
        break
      case 'planting':
        activityField = 'plantingActivity'
        break
      case 'fertilize':
        activityField = 'fertilizationActivity'
        break
      case 'pesticide':
        activityField = 'pestAndDiseaseControlActivity'
        break
      case 'other':
        activityField = 'other'
        break
      default:
        throw new BadRequestError('Invalid process type')
    }

    if (!activity[activityField]) throw new BadRequestError(`Missing ${activityField} field for process type ${type}`)

    const updatedProject = await addProcess({
      projectId,
      process: { time, type, [activityField]: activity[activityField], createdAtTime: new Date() }
    })
    if (!updatedProject) throw new MethodFailureError('Cannot add process')
    return updatedProject
  }

  static async updateProcess({ projectId, processId, process }) {
    if (!projectId) throw new BadRequestError('Missing project id')
    if (!isValidObjectId(projectId)) throw new BadRequestError('Invalid project id')
    if (!processId) throw new BadRequestError('Missing process id')
    if (!isValidObjectId(processId)) throw new BadRequestError('Invalid process id')
    if (!process) throw new BadRequestError('Missing process')

    const { isEdited, historyProcess, ...updatedProcess } = process
    const updatedProject = await updateProcess({
      projectId,
      processId,
      newProcessData: removeUndefinedObject({
        ...updatedProcess,
        createdAtTime: new Date()
      })
    })
    if (!updatedProject) throw new MethodFailureError('Cannot update process')
    return updatedProject
  }

  static async deleteProcess({ projectId, processId }) {
    if (!projectId) throw new BadRequestError('Missing project id')
    if (!isValidObjectId(projectId)) throw new BadRequestError('Invalid project id')
    if (!processId) throw new BadRequestError('Missing process id')
    if (!isValidObjectId(processId)) throw new BadRequestError('Invalid process id')

    const updatedProject = await deleteProcess({ projectId, processId })
    if (!updatedProject) throw new MethodFailureError('Cannot delete process')
    return updatedProject
  }

  // ...

  static async getPlantFarming({ projectId }) {
    if (!projectId) throw new BadRequestError('Missing project id')
    if (!isValidObjectId(projectId)) throw new BadRequestError('Invalid project id')
    const plantFarmingId = await getPlantFarmingId({ projectId })
    if (!plantFarmingId) return null
    const plantFarming = await getPlantFarmingByPlantFarmingId({ plantFarmingId })
    if (!plantFarming) return null
    return plantFarming
  }
}

module.exports = ProjectService
