const { Types } = require('mongoose')
const {
  addPlantFarming,
  updatePlantFarming,
  deletePlantFarming,
  getAllPlantFarmingByPlant,
  getAllPlantFarmingByFarm,
  getAllPlantFarmingBySeed,
  getPlantFarmingByPlantFarmingId
} = require('../models/repositories/plantFarming.repo')
const { MethodFailureError, BadRequestError, NotFoundError } = require('../core/error.response')
const { plant } = require('../models/plant.model')
const { get } = require('lodash')
const { getPlantByPlantId } = require('./plant.service')
const { isValidObjectId, removeUndefinedObject, updateNestedObjectParser } =  require('../utils')
class PlantFarmingService {
  static async addPlantFarming({ plantFarmingData, farmId, plantId, seedId }) {
    if (!farmId) throw new BadRequestError('FarmId is required')
    if (!isValidObjectId(farmId)) throw new BadRequestError('FarmId is not valid')
    if (!plantId) throw new BadRequestError('PlantId is required')
    if (!isValidObjectId(plantId)) throw new BadRequestError('PlantId is not valid')
    if (!seedId) throw new BadRequestError('SeedId is required')
    if (!isValidObjectId(seedId)) throw new BadRequestError('SeedId is not valid')
    delete plantFarmingData._id
    delete plantFarmingData.plant
    delete plantFarmingData.seed

    const plantItem = await getPlantByPlantId({ plantId })
    if (!plantItem) {
      throw new BadRequestError('Plant does not exist with this plant id')
    }

    if (plantItem.farm.toString() !== farmId) {
      throw new BadRequestError('Farm does not have permission to create plantFarming with this plant id')
    }

    const addedPlantFarming = await addPlantFarming({ plantFarmingData, plantId, seedId })
    if (!addedPlantFarming) {
      throw new MethodFailureError('Create plant farming failed')
    }
    return addedPlantFarming
  }

  static async updatePlantFarming({ plantFarmingId, updatedData, farmId }) {
    if (!plantFarmingId) throw new BadRequestError('Plant farming id is required')
    if (!isValidObjectId(plantFarmingId)) throw new BadRequestError('Plant farming id is not valid')
    if (!farmId) throw new BadRequestError('FarmId is required')
    if (!isValidObjectId(farmId)) throw new BadRequestError('FarmId is not valid')
    if (!updatedData) throw new BadRequestError('Updated data is required')
    const objectParams = removeUndefinedObject(updatedData)
    if (Object.keys(objectParams).length === 0) {
      throw new BadRequestError('PlantFarming data is empty')
    }
    const bodyUpdate = updateNestedObjectParser(objectParams)
    if (Object.keys(bodyUpdate).length === 0) {
      throw new BadRequestError('PlantFarming data is empty')
    }

    const plantFarmingItem = await getPlantFarmingByPlantFarmingId({ plantFarmingId })
    if (!plantFarmingItem) {
      throw new NotFoundError('Plant farming not found')
    }
    if (!plantFarmingItem.plant._id) {
      throw new NotFoundError('Founded plantFarming is not valid')
    }
    const plantItem = await getPlantByPlantId({ plantId: plantFarmingItem.plant._id.toString() })
    if (!plantItem) {
      throw new NotFoundError('Plant id of Plant farming is not valid')
    }
    if (plantItem.farm.toString() !== farmId) {
      throw new BadRequestError('Farm does not have permission to create plantFarming with this plant id')
    }

    delete bodyUpdate._id
    delete bodyUpdate.plant
    delete bodyUpdate.seed
    const updatedPlantFarming = await updatePlantFarming({ plantFarmingId, updatedData: bodyUpdate })
    if (!updatedPlantFarming) {
      throw new MethodFailureError('Update plant farming failed')
    }
    return updatedPlantFarming
  }

  static async deletePlantFarming({ plantFarmingId, farmId }) {
    if (!plantFarmingId) throw new BadRequestError('Plant farming id is required')
    if (!isValidObjectId(plantFarmingId)) throw new BadRequestError('Plant farming id is not valid')
    if (!farmId) throw new BadRequestError('FarmId is required')
    if (!isValidObjectId(farmId)) throw new BadRequestError('FarmId is not valid')

    const plantFarmingItem = await getPlantFarmingByPlantFarmingId({ plantFarmingId })
    if (!plantFarmingItem) {
      throw new NotFoundError('Plant farming not found')
    }
    if (!plantFarmingItem.plant._id) {
      throw new NotFoundError('Founded plantFarming is not valid')
    }
    const plantItem = await getPlantByPlantId({ plantId: plantFarmingItem.plant._id.toString() })
    if (!plantItem) {
      throw new NotFoundError('Plant id of Plant farming is not valid')
    }
    if (plantItem.farm.toString() !== farmId) {
      throw new BadRequestError('Farm does not have permission to create plantFarming with this plant id')
    }

    const deletedPlantFarming = await deletePlantFarming({ plantFarmingId })
    if (!deletedPlantFarming) {
      throw new MethodFailureError('Delete plant farming failed')
    }
    return deletedPlantFarming
  }

  static async getAllPlantFarmingByPlant({ plantId, limit, sort, page }) {
    if (!plantId) throw new BadRequestError('Plant id is required')
    if (!isValidObjectId(plantId)) throw new BadRequestError('Plant id is not valid')
    const filter = { plant: new Types.ObjectId(plantId) }
    return getAllPlantFarmingByPlant({ limit, sort, page, filter })
  }

  static async getPlantFarmingByPlantFarmingId({ plantFarmingId }) {
    if (!plantFarmingId) throw new BadRequestError('Plant farming id is required')
    if (!isValidObjectId(plantFarmingId)) throw new BadRequestError('Plant farming id is not valid')

    const plantFarmingItem = await getPlantFarmingByPlantFarmingId({ plantFarmingId })
    if (!plantFarmingItem) {
      throw new NotFoundError('Plant farming not found')
    }
    return plantFarmingItem
  }
}

module.exports = PlantFarmingService
