const { Types } = require('mongoose')
const {
  getAllGardenServiceRequestsByFarm,
  getGardenServiceRequestByGardenServiceRequestId,
  addGardenServiceRequest,
  updateGardenServiceRequest,
  deleteGardenServiceRequest
} = require('../models/repositories/gardenServiceRequest.repo')
const { getSeedDefaultFromPlantId } = require('./seed.service')
const { checkPlantExist } = require('./plant.service')
const { initProject, addPlantFarmingToProject } = require('./project.service')

const { MethodFailureError, BadRequestError, NotFoundError } = require('../core/error.response')
const { isValidObjectId } = require('../utils')
const { getGardenServiceTemplateByGardenServiceTemplateId } = require('./gardenServiceTemplate.service')
const { getPlantFarmingBySeedId } = require('./plantFarming.service')
const { createGarden } = require('./garden.service')

class GardenServiceRequestService {
  static async getAllGardenServiceRequestsByFarm({ farmId, limit, sort, page }) {
    if (!farmId) throw new BadRequestError('FarmId is required')
    if (!isValidObjectId(farmId)) throw new BadRequestError('FarmId is not valid')
    const filter = { farm: new Types.ObjectId(farmId) }
    const gardenServiceRequests = await getAllGardenServiceRequestsByFarm({ limit, sort, page, filter })

    return gardenServiceRequests
  }

  static async getAllGardenServiceRequestsWaitingByFarm({ farmId, limit, sort, page }) {
    if (!farmId) throw new BadRequestError('FarmId is required')
    if (!isValidObjectId(farmId)) throw new BadRequestError('FarmId is not valid')
    const filter = { farm: new Types.ObjectId(farmId), status: 'waiting' }
    const gardenServiceRequests = await getAllGardenServiceRequestsByFarm({ limit, sort, page, filter })

    return gardenServiceRequests
  }

  static async getAllGardenServiceRequestsAcceptedByFarm({ farmId, limit, sort, page }) {
    if (!farmId) throw new BadRequestError('FarmId is required')
    if (!isValidObjectId(farmId)) throw new BadRequestError('FarmId is not valid')
    const filter = { farm: new Types.ObjectId(farmId), status: 'accepted' }
    const gardenServiceRequests = await getAllGardenServiceRequestsByFarm({ limit, sort, page, filter })

    return gardenServiceRequests
  }

  static async getAllGardenServiceRequestsRejectedByFarm({ farmId, limit, sort, page }) {
    if (!farmId) throw new BadRequestError('FarmId is required')
    if (!isValidObjectId(farmId)) throw new BadRequestError('FarmId is not valid')
    const filter = { farm: new Types.ObjectId(farmId), status: 'rejected' }
    const gardenServiceRequests = await getAllGardenServiceRequestsByFarm({ limit, sort, page, filter })

    return gardenServiceRequests
  }

  static async getGardenServiceRequestByGardenServiceRequestId({ gardenServiceRequestId }) {
    if (!gardenServiceRequestId) throw new BadRequestError('GardenServiceRequestId is required')
    if (!isValidObjectId(gardenServiceRequestId)) throw new BadRequestError('GardenServiceRequestId is not valid')
    const gardenServiceRequestItem = await getGardenServiceRequestByGardenServiceRequestId({ gardenServiceRequestId })
    if (!gardenServiceRequestItem) {
      throw new NotFoundError('GardenServiceRequest not found')
    }
    return gardenServiceRequestItem
  }

  static async addGardenServiceRequest({ gardenServiceRequestData, clientId }) {
    if (!clientId) throw new BadRequestError('FarmId is required')
    if (!isValidObjectId(clientId)) throw new BadRequestError('clientId is not valid')
    if (!gardenServiceRequestData) throw new BadRequestError('GardenServiceRequest data is required')
    const { time, gardenServiceTemplateId, herbListId, leafyListId, rootListId, fruitListId, note } =
      gardenServiceRequestData
    if (!time) throw new BadRequestError('Time is required')
    if (!gardenServiceTemplateId) throw new BadRequestError('GardenServiceTemplateId is required')
    if (!isValidObjectId(gardenServiceTemplateId)) throw new BadRequestError('GardenServiceTemplateId is not valid')
    const gardenServiceTemplateItem = await getGardenServiceTemplateByGardenServiceTemplateId({
      gardenServiceTemplateId
    })
    if (!gardenServiceTemplateItem) {
      throw new NotFoundError('GardenServiceTemplate not found')
    }
    const farmId = gardenServiceTemplateItem.farm.toString()
    if (!herbListId) throw new BadRequestError('HerbListId is required')
    if (!leafyListId) throw new BadRequestError('LeafyListId is required')
    if (!rootListId) throw new BadRequestError('RootListId is required')
    if (!fruitListId) throw new BadRequestError('FruitListId is required')
    if (!note) throw new BadRequestError('Note is required')
    const status = 'waiting'
    const createdGardenServiceRequest = await addGardenServiceRequest({
      time,
      clientId,
      farmId,
      gardenServiceTemplateId,
      herbListId,
      leafyListId,
      rootListId,
      fruitListId,
      note,
      status
    })
    if (!createdGardenServiceRequest) {
      throw new MethodFailureError('Create gardenServiceRequest failed')
    }
    return createdGardenServiceRequest
  }

  static async updatedGardenServiceRequest({ gardenServiceRequestId, gardenServiceRequestData, clientId }) {
    if (!gardenServiceRequestId) throw new BadRequestError('GardenServiceRequestId is required')
    if (!isValidObjectId(gardenServiceRequestId)) throw new BadRequestError('GardenServiceRequestId is not valid')
    if (!gardenServiceRequestData) throw new BadRequestError('GardenServiceRequest data is required')

    const gardenServiceRequestItem = await getGardenServiceRequestByGardenServiceRequestId({
      gardenServiceRequestId
    })
    if (!gardenServiceRequestItem) {
      throw new NotFoundError('GardenServiceRequest not found')
    }

    if (gardenServiceRequestItem.client.toString() !== clientId) {
      throw new MethodFailureError('Not authorized to update this GardenServiceRequest')
    }

    const { herbListId, leafyListId, rootListId, fruitListId, note } = gardenServiceRequestData

    const updatedGardenServiceRequest = await updateGardenServiceRequest({
      gardenServiceRequestId,
      herbListId,
      leafyListId,
      rootListId,
      fruitListId,
      note
    })
    if (!updatedGardenServiceRequest) {
      throw new MethodFailureError('Update gardenServiceRequest failed')
    }
    return updatedGardenServiceRequest
  }

  static async deleteGardenServiceRequest({ gardenServiceRequestId, clientId }) {
    if (!gardenServiceRequestId) throw new BadRequestError('GardenServiceRequestId is required')
    if (!isValidObjectId(gardenServiceRequestId)) throw new BadRequestError('GardenServiceRequestId is not valid')

    const gardenServiceRequestItem = await getGardenServiceRequestByGardenServiceRequestId({
      gardenServiceRequestId
    })
    if (!gardenServiceRequestItem) {
      throw new NotFoundError('GardenServiceRequest not found')
    }

    if (gardenServiceRequestItem.client.toString() !== clientId) {
      throw new MethodFailureError('Not authorized to delete this GardenServiceRequest')
    }

    const deletedGardenServiceRequest = await deleteGardenServiceRequest({ gardenServiceRequestId })
    if (!deletedGardenServiceRequest) {
      throw new MethodFailureError('Delete gardenServiceRequest failed')
    }
    return deletedGardenServiceRequest
  }

  static async acceptGardenServiceRequest({ gardenServiceRequestId, farmId }) {
    if (!gardenServiceRequestId) throw new BadRequestError('GardenServiceRequestId is required')
    if (!isValidObjectId(gardenServiceRequestId)) throw new BadRequestError('GardenServiceRequestId is not valid')

    const gardenServiceRequestItem = await getGardenServiceRequestByGardenServiceRequestId({
      gardenServiceRequestId
    })
    if (!gardenServiceRequestItem) {
      throw new NotFoundError('GardenServiceRequest not found')
    }

    if (gardenServiceRequestItem.farm._id.toString() !== farmId) {
      throw new MethodFailureError('Not authorized to accept this GardenServiceRequest')
    }

    // init project for each plant with seed Default
    const plantList = [
      ...gardenServiceRequestItem.herbList,
      ...gardenServiceRequestItem.leafyList,
      ...gardenServiceRequestItem.rootList,
      ...gardenServiceRequestItem.fruitList
    ]

    // check plant exist
    await Promise.all(
      plantList.map(async (plant) => {
        const isPlantExist = await checkPlantExist({ plantId: plant._id.toString() })
        if (!isPlantExist) {
          throw new NotFoundError(`Request plant ${plant._id.toString()} not found`)
        }
      })
    )

    const initProjectsData = await Promise.all(
      plantList.map(async (plant) => {
        const seedDefault = await getSeedDefaultFromPlantId({ plantId: plant._id.toString() })
        if (!seedDefault) {
          throw new NotFoundError('Seed default not found')
        }
        return {
          plantId: plant._id.toString(),
          seedId: seedDefault._id.toString()
        }
      })
    )

    let projectIds = []
    await Promise.all(
      initProjectsData.map(async (projectData) => {
        const projectItem = await initProject({
          farmId,
          project: projectData,
          status: 'inProgress',
          startDate: new Date()
        })
        // add PlantFarming to each project with seed Default
        const plantFarmingList = await getPlantFarmingBySeedId({ seedId: projectData.seedId })
        if (!plantFarmingList) {
          throw new NotFoundError('Plant farming not found')
        }
        let plantFarmingItem = plantFarmingList.find((item) => item.isPlantFarmingDefault === true)
        if (!plantFarmingItem) {
          plantFarmingItem = plantFarmingList[0]
        }
        const updatedProject = await addPlantFarmingToProject({
          farmId,
          projectId: projectItem._id.toString(),
          plantFarming: plantFarmingItem
        })
        projectIds.push(projectItem._id.toString())
        if (!updatedProject) {
          throw new MethodFailureError('Add plant farming to project failed')
        }
      })
    )

    // create Garden
    const gardenItem = await createGarden({
      farmId,
      clientId: gardenServiceRequestItem.client._id.toString(),
      gardenData: {
        projectIds,
        gardenServiceTemplateId: gardenServiceRequestItem.gardenServiceTemplate._id.toString(),
        gardenServiceRequestId: gardenServiceRequestId,
        startDate: new Date(),
        note: gardenServiceRequestItem.note
      }
    })

    if (!gardenItem) {
      throw new MethodFailureError('Create garden failed')
    }

    const acceptedGardenServiceRequest = await updateGardenServiceRequest({
      gardenServiceRequestId,
      status: 'accepted'
    })
    if (!acceptedGardenServiceRequest) {
      throw new MethodFailureError('Accept gardenServiceRequest failed')
    }

    return acceptedGardenServiceRequest
  }

  static async rejectGardenServiceRequest({ gardenServiceRequestId, farmId }) {
    if (!gardenServiceRequestId) throw new BadRequestError('GardenServiceRequestId is required')
    if (!isValidObjectId(gardenServiceRequestId)) throw new BadRequestError('GardenServiceRequestId is not valid')

    const gardenServiceRequestItem = await getGardenServiceRequestByGardenServiceRequestId({
      gardenServiceRequestId
    })
    if (!gardenServiceRequestItem) {
      throw new NotFoundError('GardenServiceRequest not found')
    }

    if (gardenServiceRequestItem.farm._id.toString() !== farmId) {
      throw new MethodFailureError('Not authorized to reject this GardenServiceRequest')
    }

    const rejectedGardenServiceRequest = await updateGardenServiceRequest({
      gardenServiceRequestId,
      status: 'rejected'
    })
    if (!rejectedGardenServiceRequest) {
      throw new MethodFailureError('Reject gardenServiceRequest failed')
    }
    return rejectedGardenServiceRequest
  }
}

module.exports = GardenServiceRequestService
