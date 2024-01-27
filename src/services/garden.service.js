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

  static async createGarden({ farmId, gardenData: { gardenServiceTemplateId, note, startDate } }) {
    if (!farmId) throw new BadRequestError('FarmId is required')
    if (!isValidObjectId(farmId)) throw new BadRequestError('FarmId is not valid')
    if (!gardenServiceTemplateId) throw new BadRequestError('GardenServiceTemplateId is required')
    if (!isValidObjectId(gardenServiceTemplateId)) throw new BadRequestError('GardenServiceTemplateId is not valid')
    if (!startDate) throw new BadRequestError('StartDate is required')
    const garden = await createGarden({ farmId, gardenServiceTemplateId, note, startDate })
    if (!garden) {
      throw new MethodFailureError('Create garden failed')
    }
    return garden
  }

  static async updateGardenStatus({ gardenId, status }) {
    if (!gardenId) throw new BadRequestError('GardenId is required')
    if (!isValidObjectId(gardenId)) throw new BadRequestError('GardenId is not valid')
    if (!status) throw new BadRequestError('Status is required')
    const garden = await updateGardenStatus({ gardenId, status })
    if (!garden) {
      throw new MethodFailureError('Update garden status failed')
    }
    return garden
  }

  static async addDelivery({ gardenId, deliveryData }) {
    if (!gardenId) throw new BadRequestError('GardenId is required')
    if (!deliveryData) throw new BadRequestError('Delivery data is required')
    const garden = await addDelivery({ gardenId, deliveryData })
    if (!garden) {
      throw new MethodFailureError('Add delivery failed')
    }
    return garden
  }

  static async updateDelivery({ gardenId, deliveryId, deliveryData }) {
    if (!gardenId) throw new BadRequestError('GardenId is required')
    if (!deliveryId) throw new BadRequestError('DeliveryId is required')
    if (!deliveryData) throw new BadRequestError('Delivery data is required')
    const garden = await updateDelivery({ gardenId, deliveryId, deliveryData })
    if (!garden) {
      throw new MethodFailureError('Update delivery failed')
    }
    return garden
  }

  static async deleteDelivery({ gardenId, deliveryId }) {
    if (!gardenId) throw new BadRequestError('GardenId is required')
    if (!deliveryId) throw new BadRequestError('DeliveryId is required')
    const modifiedCount = await deleteDelivery({ gardenId, deliveryId })
    if (!modifiedCount) {
      throw new MethodFailureError('Delete delivery failed')
    }
    return modifiedCount
  }

  static async addClientRequest({ gardenId, clientRequestData }) {
    if (!gardenId) throw new BadRequestError('GardenId is required')
    if (!clientRequestData) throw new BadRequestError('ClientRequest data is required')
    const garden = await addClientRequest({ gardenId, clientRequestData })
    if (!garden) {
      throw new MethodFailureError('Add clientRequest failed')
    }
    return garden
  }

  static async updateClientRequest({ gardenId, clientRequestId, clientRequestData }) {
    if (!gardenId) throw new BadRequestError('GardenId is required')
    if (!clientRequestId) throw new BadRequestError('ClientRequestId is required')
    if (!clientRequestData) throw new BadRequestError('ClientRequest data is required')
    const garden = await updateClientRequest({ gardenId, clientRequestId, clientRequestData })
    if (!garden) {
      throw new MethodFailureError('Update clientRequest failed')
    }
    return garden
  }

  static async deleteClientRequest({ gardenId, clientRequestId }) {
    if (!gardenId) throw new BadRequestError('GardenId is required')
    if (!clientRequestId) throw new BadRequestError('ClientRequestId is required')
    const modifiedCount = await deleteClientRequest({ gardenId, clientRequestId })
    if (!modifiedCount) {
      throw new MethodFailureError('Delete clientRequest failed')
    }
    return modifiedCount
  }
}

module.exports = GardenService
