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
  deleteClientRequest,
  deleteGarden,
  updateCameraToGarden
} = require('../models/repositories/garden.repo')
const { MethodFailureError, BadRequestError, NotFoundError } = require('../core/error.response')
const { isValidObjectId } = require('../utils')
const { initProject, addPlantFarmingToProject, deleteProject } = require('./project.service')
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

  static async getCameraInGarden({ gardenId }) {
    if (!gardenId) throw new BadRequestError('GardenId is required')
    if (!isValidObjectId(gardenId)) throw new BadRequestError('GardenId is not valid')
    // get camera in garden
    const gardenItem = await getGardenById({ gardenId })
    if (!gardenItem) {
      throw new NotFoundError('Garden not found')
    }
    const camera = gardenItem.camera
    return camera || []
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

  static async deleteGarden({ farmId, gardenId }) {
    if (!gardenId) throw new BadRequestError('GardenId is required')
    if (!isValidObjectId(gardenId)) throw new BadRequestError('GardenId is not valid')
    const gardenItem = await getGardenById({ gardenId })
    if (!gardenItem) {
      throw new NotFoundError('Garden not found')
    }
    if (gardenItem.farm._id.toString() !== farmId) {
      throw new BadRequestError('Not permission to delete garden')
    }
    // delete all project in garden
    const projectIdList = gardenItem.projects
    for (const projectId of projectIdList) {
      const project = await deleteProject({ projectId, farmId })
      if (!project) {
        throw new MethodFailureError('Delete project failed')
      }
    }
    const modifiedCount = await deleteGarden({ gardenId })
    if (!modifiedCount) {
      throw new MethodFailureError('Delete garden failed')
    }
    return modifiedCount
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

    const projectItem = await initProject({ farmId, project, status: 'inProgress', startDate })
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
    if (gardenItem.farm._id.toString() !== farmId) {
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

    if (gardenItem.farm._id.toString() !== farmId) {
      throw new BadRequestError('Not permission to add delivery')
    }

    const { deliveryDetails, note } = deliveryData
    if (!deliveryDetails) throw new BadRequestError('DeliveryDetails is required')
    if (!Array.isArray(deliveryDetails)) throw new BadRequestError('DeliveryDetails must be an array')
    let formattedDeliveryDetails = []
    for (const detail of deliveryDetails) {
      if (!detail.plant) throw new BadRequestError('Plant is required')
      if (!isValidObjectId(detail.plant)) throw new BadRequestError('Plant is not valid')
      if (!detail.amount && detail.amount != 0) throw new BadRequestError('Amount is required')
      if (isNaN(detail.amount)) throw new BadRequestError('Amount is not valid')
      if (detail.amount < 0) throw new BadRequestError('Amount is not valid')
      formattedDeliveryDetails.push({
        plant: new Types.ObjectId(detail.plant),
        amount: detail.amount
      })
    }
    const formatDeliveryData = {
      time: new Date(),
      deliveryDetails: formattedDeliveryDetails,
      note,
      status: 'coming',
      clientAccept: false
    }
    const garden = await addDelivery({ gardenId, formatDeliveryData })
    if (!garden) {
      throw new MethodFailureError('Add delivery failed')
    }
    return garden
  }

  static async updateDelivery({ farmId, gardenId, deliveryId, deliveryData }) {
    if (!gardenId) throw new BadRequestError('GardenId is required')
    if (!isValidObjectId(gardenId)) throw new BadRequestError('GardenId is not valid')
    if (!deliveryData) throw new BadRequestError('Delivery data is required')
    if (!deliveryId) throw new BadRequestError('DeliveryId is required')
    if (!isValidObjectId(deliveryId)) throw new BadRequestError('DeliveryId is not valid')
    const gardenItem = await getGardenById({ gardenId })
    if (!gardenItem) {
      throw new NotFoundError('Garden not found')
    }

    if (gardenItem.farm._id.toString() !== farmId) {
      throw new BadRequestError('Not permission to add delivery')
    }

    const { deliveryDetails, note, status } = deliveryData
    let formattedDeliveryDetails = []
    if (deliveryDetails) {
      if (!Array.isArray(deliveryDetails)) throw new BadRequestError('DeliveryDetails must be an array')
      for (const detail of deliveryDetails) {
        if (!detail.plant) throw new BadRequestError('Plant is required')
        if (!isValidObjectId(detail.plant)) throw new BadRequestError('Plant is not valid')
        if (!detail.amount && detail.amount != 0) throw new BadRequestError('Amount is required')
        if (isNaN(detail.amount)) throw new BadRequestError('Amount is not valid')
        if (detail.amount < 0) throw new BadRequestError('Amount is not valid')
        formattedDeliveryDetails.push({
          plant: new Types.ObjectId(detail.plant),
          amount: detail.amount
        })
      }
    }

    console.log('formattedDeliveryDetails', formattedDeliveryDetails)

    if (status) {
      if (status !== 'coming' && status !== 'done' && status !== 'cancel')
        throw new BadRequestError('Status is not valid')
    }

    const garden = await updateDelivery({
      gardenId,
      deliveryId,
      deliveryDetails: formattedDeliveryDetails,
      note,
      status
    })
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
    if (gardenItem.farm._id.toString() !== farmId) {
      throw new BadRequestError('Not permission to delete delivery')
    }
    const modifiedCount = await deleteDelivery({ gardenId, deliveryId })
    if (!modifiedCount) {
      throw new MethodFailureError('Delete delivery failed')
    }
    return modifiedCount
  }

  static async addClientRequest({ clientId, gardenId, clientRequestData }) {
    if (!gardenId) throw new BadRequestError('GardenId is required')
    if (!clientRequestData) throw new BadRequestError('ClientRequest data is required')
    const gardenItem = await getGardenById({ gardenId })
    if (!gardenItem) {
      throw new NotFoundError('Garden not found')
    }

    if (gardenItem.client._id.toString() !== clientId) {
      throw new BadRequestError('Not permission to add delivery')
    }

    const { type, newPlant, deliveryDetails, note } = clientRequestData
    // switch case with type must in ['newPlant', 'deliveryRequest', 'other']
    let formatClientRequestData = {}
    switch (type) {
      case 'newPlant':
        if (!newPlant) throw new BadRequestError('NewPlant is required')
        if (!isValidObjectId(newPlant)) throw new BadRequestError('NewPlant is not valid')
        formatClientRequestData = {
          time: new Date(),
          type,
          newPlant: new Types.ObjectId(newPlant),
          note
        }
        break
      case 'deliveryRequest':
        if (!deliveryDetails) throw new BadRequestError('DeliveryDetails is required')
        if (!Array.isArray(deliveryDetails)) throw new BadRequestError('DeliveryDetails must be an array')
        let formattedDeliveryDetails = []
        for (const detail of deliveryDetails) {
          if (!detail.plant) throw new BadRequestError('Plant is required')
          if (!isValidObjectId(detail.plant)) throw new BadRequestError('Plant is not valid')
          if (!detail.amount && detail.amount != 0) throw new BadRequestError('Amount is required')
          if (isNaN(detail.amount)) throw new BadRequestError('Amount is not valid')
          if (detail.amount < 0) throw new BadRequestError('Amount is not valid')
          formattedDeliveryDetails.push({
            plant: new Types.ObjectId(detail.plant),
            amount: detail.amount
          })
        }
        formatClientRequestData = {
          time: new Date(),
          type,
          deliveryDetails: formattedDeliveryDetails,
          note
        }
        break
      case 'other':
        formatClientRequestData = {
          time: new Date(),
          type,
          note
        }
        break
      default:
        throw new BadRequestError('Type is not valid')
    }
    const clientRequests = await addClientRequest({ gardenId, formatClientRequestData })
    if (!clientRequests) {
      throw new MethodFailureError('Add clientRequest failed')
    }
    return clientRequests
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

  static async updateCameraToGarden({ gardenId, cameraId }) {
    if (!gardenId) throw new BadRequestError('Missing garden id')
    if (!cameraId) throw new BadRequestError('Missing camera id')
    if (!isValidObjectId(gardenId)) throw new BadRequestError('Invalid garden id')
    // cameraId is a list of Object id
    if (!Array.isArray(cameraId)) throw new BadRequestError('Invalid camera id')
    // check each item in cameraId is valid ObjectId
    for (const id of cameraId) {
      if (!isValidObjectId(id)) throw new BadRequestError('Invalid camera id')
    }

    const updatedGarden = await updateCameraToGarden({ gardenId, cameraId })
    if (!updatedGarden) throw new MethodFailureError('Cannot update camera to garden')
    return updatedGarden
  }
}

module.exports = GardenService
