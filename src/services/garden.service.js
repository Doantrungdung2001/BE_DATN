const { Types } = require('mongoose')
const {
  getAllGardensByFarm,
  getGardenById,
  getProjectsInfoByGarden,
  getProjectPlantFarmingByGarden,
  getProjectProcessByGarden,
  getClientRequestsByGarden,
  getDeliveriesByGarden,
  createGarden,
  addNewProjectToGarden,
  updateGardenStatus,
  addDelivery,
  updateDelivery,
  deleteDelivery,
  addClientRequest,
  updateClientRequest,
  deleteClientRequest
} = require('../models/repositories/garden.repo')
const { MethodFailureError, BadRequestError, NotFoundError } = require('../core/error.response')
const { isValidObjectId } = require('../utils')
const { initProject, addPlantFarmingToProject } = require('./project.service')
const { getSeedDefaultFromPlantId } = require('./seed.service')
const { getPlantFarmingBySeedId } = require('./plantFarming.service')

class GardenService {
  static async getAllGardensByFarm({ farmId, limit, sort, page }) {
    if (!farmId) throw new BadRequestError('FarmId is required')
    if (!isValidObjectId(farmId)) throw new BadRequestError('FarmId is not valid')
    const filter = { farm: new Types.ObjectId(farmId) }
    const gardens = await getAllGardensByFarm({ limit, sort, page, filter })

    return gardens
  }

  static async getGardenById({ gardenId }) {
    if (!gardenId) throw new BadRequestError('GardenId is required')
    if (!isValidObjectId(gardenId)) throw new BadRequestError('GardenId is not valid')
    const garden = await getGardenById({ gardenId })
    if (!garden) {
      throw new NotFoundError('Garden not found')
    }
    return garden
  }

  static async getProjectsInfoByGarden({ gardenId }) {
    if (!gardenId) throw new BadRequestError('GardenId is required')
    if (!isValidObjectId(gardenId)) throw new BadRequestError('GardenId is not valid')
    const garden = await getProjectsInfoByGarden({ gardenId })
    if (!garden) {
      throw new NotFoundError('Garden not found')
    }
    return garden
  }

  static async getProjectPlantFarmingByGarden({ gardenId, projectId }) {
    if (!gardenId) throw new BadRequestError('GardenId is required')
    if (!isValidObjectId(gardenId)) throw new BadRequestError('GardenId is not valid')
    if (!projectId) throw new BadRequestError('ProjectId is required')
    if (!isValidObjectId(projectId)) throw new BadRequestError('ProjectId is not valid')
    const garden = await getProjectPlantFarmingByGarden({ gardenId, projectId })
    if (!garden) {
      throw new NotFoundError('Garden not found')
    }
    return garden
  }

  static async getProjectProcessByGarden({ gardenId, projectId }) {
    if (!gardenId) throw new BadRequestError('GardenId is required')
    if (!isValidObjectId(gardenId)) throw new BadRequestError('GardenId is not valid')
    if (!projectId) throw new BadRequestError('ProjectId is required')
    if (!isValidObjectId(projectId)) throw new BadRequestError('ProjectId is not valid')
    const garden = await getProjectProcessByGarden({ gardenId, projectId })
    if (!garden) {
      throw new NotFoundError('Garden not found')
    }
    return garden
  }

  static async getClientRequestsByGarden({ gardenId }) {
    if (!gardenId) throw new BadRequestError('GardenId is required')
    if (!isValidObjectId(gardenId)) throw new BadRequestError('GardenId is not valid')
    const garden = await getClientRequestsByGarden({ gardenId })
    if (!garden) {
      throw new NotFoundError('Garden not found')
    }
    return garden
  }

  static async getDeliveriesByGarden({ gardenId }) {
    if (!gardenId) throw new BadRequestError('GardenId is required')
    if (!isValidObjectId(gardenId)) throw new BadRequestError('GardenId is not valid')
    const garden = await getDeliveriesByGarden({ gardenId })
    if (!garden) {
      throw new NotFoundError('Garden not found')
    }
    return garden
  }

  static async createGarden({
    farmId,
    clientId,
    gardenData: { gardenServiceTemplateId, gardenServiceRequestId, projectIds, startDate, note }
  }) {
    if (!farmId) throw new BadRequestError('FarmId is required')
    if (!isValidObjectId(farmId)) throw new BadRequestError('FarmId is not valid')
    if (!clientId) throw new BadRequestError('ClientId is required')
    if (!isValidObjectId(clientId)) throw new BadRequestError('ClientId is not valid')
    if (!gardenServiceTemplateId) throw new BadRequestError('GardenServiceTemplateId is required')
    if (!isValidObjectId(gardenServiceTemplateId)) throw new BadRequestError('GardenServiceTemplateId is not valid')
    if (!startDate) throw new BadRequestError('StartDate is required')
    const status = 'started'
    const garden = await createGarden({
      farmId,
      clientId,
      projectIds,
      gardenServiceTemplateId,
      gardenServiceRequestId,
      startDate,
      note,
      status
    })
    if (!garden) {
      throw new MethodFailureError('Create garden failed')
    }
    return garden
  }

  static async addNewProjectToGarden({ farmId, gardenId, plantId, seedId, startDate }) {
    if (!gardenId) throw new BadRequestError('GardenId is required')
    if (!isValidObjectId(gardenId)) throw new BadRequestError('GardenId is not valid')
    if (!plantId) throw new BadRequestError('Project is required')
    if (!isValidObjectId(plantId)) throw new BadRequestError('PlantId is not valid')
    if (!seedId) throw new BadRequestError('SeedId is required')
    if (!isValidObjectId(seedId)) throw new BadRequestError('SeedId is not valid')
    if (!startDate) throw new BadRequestError('StartDate is required')

    const project = {
      plantId,
      seedId,
      startDate
    }

    const projectItem = await initProject({ farmId, project, isGarden: true, status: 'inProgress', startDate })
    if (!projectItem) {
      throw new MethodFailureError('Create project failed')
    }

    const plantFarmingList = await getPlantFarmingBySeedId({ seedId })
    if (!plantFarmingList) {
      throw new NotFoundError('Plant farming not found')
    }

    let plantFarming = plantFarmingList.find((item) => item.isPlantFarmingDefault === true)
    if (!plantFarming) {
      plantFarming = plantFarmingList[0]
    }

    const addPlantFarming = await addPlantFarmingToProject({
      farmId,
      projectId: projectItem._id.toString(),
      plantFarming
    })
    if (!addPlantFarming) {
      throw new MethodFailureError('Add plant farming to project failed')
    }

    const garden = await addNewProjectToGarden({ gardenId, projectId: projectItem._id.toString() })
    if (!garden) {
      throw new MethodFailureError('Add new project to garden failed')
    }
    return garden
  }

  static async updateGardenStatus({ farmId, gardenId, status }) {
    if (!gardenId) throw new BadRequestError('GardenId is required')
    if (!isValidObjectId(gardenId)) throw new BadRequestError('GardenId is not valid')
    if (!status) throw new BadRequestError('Status is required')
    const gardenItem = await getGardenById({ gardenId })
    if (!gardenItem) {
      throw new NotFoundError('Garden not found')
    }
    if (gardenItem.status === status) {
      throw new BadRequestError('Status is not changed')
    }
    if (gardenItem.farm.toString() !== farmId) {
      throw new BadRequestError('Not permission to update garden status')
    }
    const garden = await updateGardenStatus({ gardenId, status })
    if (!garden) {
      throw new MethodFailureError('Update garden status failed')
    }
    return garden
  }

  static async addDelivery({ farmId, gardenId, deliveryData }) {
    if (!gardenId) throw new BadRequestError('GardenId is required')
    if (!deliveryData) throw new BadRequestError('Delivery data is required')
    const gardenItem = await getGardenById({ gardenId })
    if (!gardenItem) {
      throw new NotFoundError('Garden not found')
    }

    if (gardenItem.farm.toString() !== farmId) {
      throw new BadRequestError('Not permission to add delivery')
    }
    const garden = await addDelivery({ gardenId, deliveryData })
    if (!garden) {
      throw new MethodFailureError('Add delivery failed')
    }
    return garden
  }

  static async updateDelivery({ farmId, gardenId, deliveryId, deliveryData }) {
    if (!gardenId) throw new BadRequestError('GardenId is required')
    if (!deliveryId) throw new BadRequestError('DeliveryId is required')
    if (!deliveryData) throw new BadRequestError('Delivery data is required')
    const gardenItem = await getGardenById({ gardenId })
    if (!gardenItem) {
      throw new NotFoundError('Garden not found')
    }

    if (gardenItem.farm.toString() !== farmId) {
      throw new BadRequestError('Not permission to add delivery')
    }
    const garden = await updateDelivery({ gardenId, deliveryId, deliveryData })
    if (!garden) {
      throw new MethodFailureError('Update delivery failed')
    }
    return garden
  }

  static async deleteDelivery({ farmId, gardenId, deliveryId }) {
    if (!gardenId) throw new BadRequestError('GardenId is required')
    if (!deliveryId) throw new BadRequestError('DeliveryId is required')
    const gardenItem = await getGardenById({ gardenId })
    if (!gardenItem) {
      throw new NotFoundError('Garden not found')
    }
    if (gardenItem.farm.toString() !== farmId) {
      throw new BadRequestError('Not permission to add delivery')
    }
    const modifiedCount = await deleteDelivery({ gardenId, deliveryId })
    if (!modifiedCount) {
      throw new MethodFailureError('Delete delivery failed')
    }
    return modifiedCount
  }

  static async addClientRequest({ farmId, gardenId, clientRequestData }) {
    if (!gardenId) throw new BadRequestError('GardenId is required')
    if (!clientRequestData) throw new BadRequestError('ClientRequest data is required')
    const gardenItem = await getGardenById({ gardenId })
    if (!gardenItem) {
      throw new NotFoundError('Garden not found')
    }

    if (gardenItem.farm.toString() !== farmId) {
      throw new BadRequestError('Not permission to add delivery')
    }
    const garden = await addClientRequest({ gardenId, clientRequestData })
    if (!garden) {
      throw new MethodFailureError('Add clientRequest failed')
    }
    return garden
  }

  static async updateClientRequest({ farmId, gardenId, clientRequestId, clientRequestData }) {
    if (!gardenId) throw new BadRequestError('GardenId is required')
    if (!clientRequestId) throw new BadRequestError('ClientRequestId is required')
    if (!clientRequestData) throw new BadRequestError('ClientRequest data is required')
    const gardenItem = await getGardenById({ gardenId })
    if (!gardenItem) {
      throw new NotFoundError('Garden not found')
    }

    if (gardenItem.farm.toString() !== farmId) {
      throw new BadRequestError('Not permission to add delivery')
    }
    const garden = await updateClientRequest({ gardenId, clientRequestId, clientRequestData })
    if (!garden) {
      throw new MethodFailureError('Update clientRequest failed')
    }
    return garden
  }

  static async deleteClientRequest({ farmId, gardenId, clientRequestId }) {
    if (!gardenId) throw new BadRequestError('GardenId is required')
    if (!clientRequestId) throw new BadRequestError('ClientRequestId is required')
    const gardenItem = await getGardenById({ gardenId })
    if (!gardenItem) {
      throw new NotFoundError('Garden not found')
    }

    if (gardenItem.farm.toString() !== farmId) {
      throw new BadRequestError('Not permission to add delivery')
    }
    const modifiedCount = await deleteClientRequest({ gardenId, clientRequestId })
    if (!modifiedCount) {
      throw new MethodFailureError('Delete clientRequest failed')
    }
    return modifiedCount
  }
}

module.exports = GardenService
