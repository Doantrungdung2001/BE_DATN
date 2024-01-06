const { Types } = require('mongoose')
const {
  searchSeedByUser,
  findAllSeeds,
  findSeedBySeedId,
  addSeed,
  updateSeed,
  deleteSeed,
  getSeedByPlantInFarm
} = require('../models/repositories/seed.repo')
const { BadRequestError } = require('../core/error.response')
const { updateNestedObjectParser, removeUndefinedObject, isValidObjectId } = require('../utils')
const { plant } = require('../models/plant.model')
const { default: slugify } = require('slugify')
const { findAllPlants } = require('../models/repositories/plant.repo')

class SeedService {
  static async searchSeedByUser({ keySearch }) {
    return await searchSeedByUser({ keySearch })
  }

  static async findAllSeeds({ farmId, limit, sort, page }) {
    if (!farmId) {
      throw new BadRequestError('Farm id is required')
    }
    if (!isValidObjectId(farmId)) {
      throw new BadRequestError('Invalid farm id')
    }
    const plantItem = await findAllPlants({ farm: new Types.ObjectId(farmId) })
    const plantIds = plantItem.map((item) => item._id)

    const filter = { plant: { $in: plantIds } }
    const seeds = await findAllSeeds({ limit, sort, page, filter })

    return seeds
  }

  static async findSeedBySeedId({ seedId }) {
    if (!seedId) {
      throw new BadRequestError('Seed id is required')
    }
    if (!isValidObjectId(seedId)) {
      throw new BadRequestError('Invalid seed id')
    }

    return findSeedBySeedId({ seedId })
  }

  static async getSeedByPlantInFarm({ plantName, plantId, farmId }) {
    if (plantName && farmId) {
      if (!isValidObjectId(farmId)) {
        throw new BadRequestError('Invalid farm id')
      }
      const plantItem = await plant
        .findOne({ plant_name: plantName, farm: new Types.ObjectId(farmId) })
        .lean()
        .exec()
      if (!plantItem) {
        throw new BadRequestError('Plant not found')
      }
      return getSeedByPlantInFarm({ plantId: plantItem._id.toString() })
    }
    if (!plantId) {
      throw new BadRequestError('Plant id is required')
    }
    if (!isValidObjectId(plantId)) {
      throw new BadRequestError('Invalid plant id')
    }
    return getSeedByPlantInFarm({ plantId })
  }

  static async addSeed({ seedData, farmId, plantId }) {
    if (!seedData) {
      throw new BadRequestError('Seed data is required')
    }

    if (!plantId) {
      throw new BadRequestError('Plant id is required')
    }

    if (!isValidObjectId(plantId)) {
      throw new BadRequestError('Invalid plant id')
    }

    if (!farmId) {
      throw new BadRequestError('Farm id is required')
    }

    if (!isValidObjectId(farmId)) {
      throw new BadRequestError('Invalid farm id')
    }

    const plantItem = await plant
      .findOne({ _id: new Types.ObjectId(plantId), farm: new Types.ObjectId(farmId) })
      .lean()
      .exec()
    if (!plantItem) {
      throw new BadRequestError('Plant not found in the farm')
    }

    delete seedData.plantId

    return addSeed({ seedData, farmId, plantId })
  }

  static async updateSeed({ seedId, seedData, farmId }) {
    if (!seedData) {
      throw new BadRequestError('Seed data is required')
    }
    if (!seedId) {
      throw new BadRequestError('Seed id is required')
    }

    if (!isValidObjectId(seedId)) {
      throw new BadRequestError('Invalid seed id')
    }

    if (!farmId) {
      throw new BadRequestError('Farm id is required')
    }

    if (!isValidObjectId(farmId)) {
      throw new BadRequestError('Invalid farm id')
    }
    const seedItem = await findSeedBySeedId({ seedId })
    if (!seedItem) {
      throw new BadRequestError('Seed not found')
    }
    if (seedItem.plant.farm.toString() !== farmId) {
      throw new BadRequestError('Farm does not have permission to update seeds')
    }

    const objectParams = removeUndefinedObject(seedData)
    const bodyUpdate = updateNestedObjectParser(objectParams)
    delete bodyUpdate._id
    delete bodyUpdate.plantId

    if (bodyUpdate.seed_name) {
      bodyUpdate.seed_slug = slugify(bodyUpdate.seed_name)
    }

    return updateSeed({ seedId, bodyUpdate })
  }

  static async deleteSeed({ seedId, farmId }) {
    if (!seedId) {
      throw new BadRequestError('Seed id is required')
    }
    if (!isValidObjectId(seedId)) {
      throw new BadRequestError('Invalid seed id')
    }
    if (!farmId) {
      throw new BadRequestError('Farm id is required')
    }
    if (!isValidObjectId(farmId)) {
      throw new BadRequestError('Invalid farm id')
    }
    const seed = await findSeedBySeedId({ seedId })
    if (!seed) {
      throw new BadRequestError('Seed not found')
    }
    if (seed.plant.farm.toString() !== farmId) {
      throw new BadRequestError('Farm does not have permission to update seeds')
    }

    return deleteSeed(seedId)
  }
}

module.exports = SeedService
