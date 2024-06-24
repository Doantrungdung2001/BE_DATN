'use strict'
const { Types } = require('mongoose')
const { findFarmByEmail, getFarm, updateFarm, getAllFarms, deleteFarm } = require('../models/repositories/farm.repo')
const { BadRequestError, MethodFailureError } = require('../core/error.response')
const { removeUndefinedObject, isValidObjectId } = require('../utils')
const { findUserByEmail, getUser } = require('./user.service')
const { plant } = require('../models/plant.model')
const { gardenServiceTemplate } = require('../models/gardenServiceTemplate.model')
const { farm } = require('../models/farm.model')

class FarmService {
  static async findByEmail({ email }) {
    if (!email) {
      throw new BadRequestError('Email is required')
    }
    return await findFarmByEmail({ email })
  }

  static async getFarm({ farmId }) {
    if (!farmId) {
      throw new BadRequestError('Farm ID is required')
    }
    if (!isValidObjectId(farmId)) {
      throw new BadRequestError('Farm ID is invalid')
    }
    return await getFarm({ farmId })
  }

  static async updateInfoFarm({ farmId, farm }) {
    if (!farmId) {
      throw new BadRequestError('Farm ID is required')
    }
    if (!isValidObjectId(farmId)) {
      throw new BadRequestError('Farm ID is invalid')
    }
    if (!farm) {
      throw new BadRequestError('Farm is required')
    }

    const { name, description, status, district, address, images, lat, lng, phone, email, name_slug, avatar } = farm

    return await updateFarm({
      farmId,
      farmInfo: removeUndefinedObject({
        name,
        description,
        name_slug,
        status,
        district,
        address,
        images,
        lat,
        lng,
        phone,
        email,
        avatar
      })
    })
  }

  static async getAllFarms() {
    const farms = await getAllFarms()
    if (!farms || farms.length === 0) {
      return []
    }
    // map farms and get email from user has the same _id with farm and return new array
    const farmWithUser = await Promise.all(
      farms.map(async (farm) => {
        const user = await getUser({ userId: farm._id.toString() })
        return {
          _id: farm._id,
          name: farm.name,
          description: farm.description,
          status: farm.status,
          district: farm.district,
          address: farm.address,
          createdAt: farm.createdAt,
          email: user.email,
          roles: user.roles[0],
          lat: farm.lat,
          lng: farm.lng,
          avatar: farm.avatar
        }
      })
    )

    const allFarms = farmWithUser.filter((farm) => farm.roles === 'FARM')

    return allFarms
  }

  static async updateStatusFarm({ farmId, status }) {
    if (!farmId) {
      throw new BadRequestError('Farm ID is required')
    }
    if (!isValidObjectId(farmId)) {
      throw new BadRequestError('Farm ID is invalid')
    }
    if (!status) {
      throw new BadRequestError('Status is required')
    }
    if (status !== 'active' && status !== 'inactive') {
      throw new BadRequestError('Status is invalid')
    }

    console.log('farmId', farmId)
    console.log('status', status)
    const updatedFarm = await updateFarm({ farmId, farmInfo: { status } })

    if (!updatedFarm) {
      throw new MethodFailureError('Update farm status failed')
    }

    return updatedFarm
  }

  static async searchFarms({ priceRange, squareRange, plantNames, district }) {
    const filter = {}

    // Filter theo tỉnh
    if (district) {
      filter.district = district
    }

    // Tìm các farmId dựa trên bộ lọc GardenServiceTemplate
    const gardenServiceFilter = {}

    if (priceRange) {
      gardenServiceFilter.price = { $gte: priceRange.min, $lte: priceRange.max }
    }

    if (squareRange) {
      gardenServiceFilter.square = { $gte: squareRange.min, $lte: squareRange.max }
    }

    const gardenServices = await gardenServiceTemplate.find(gardenServiceFilter).select('farm')
    const farmIdsFromGardenService = gardenServices.map((gs) => gs.farm)
    console.log('farmIdsFromGardenService', farmIdsFromGardenService)

    // Filter theo cây trồng
    if (plantNames && plantNames.length > 0) {
      const plants = await plant.find({ plant_name: { $in: plantNames } }).select('farm')
      const farmIdsFromPlants = plants.map((plant) => plant.farm)
      const farmIdsFromPlantsString = farmIdsFromPlants.map((id) => id.toString())

      filter._id = {
        $in: farmIdsFromGardenService.filter((farmId) => farmIdsFromPlantsString.includes(farmId.toString()))
      }

      console.log('farmIdsFromPlants', farmIdsFromPlants)
    } else {
      filter._id = { $in: farmIdsFromGardenService }
    }

    const farms = await farm.find(filter)
    return farms
  }

  static async deleteFarm({ farmId }) {
    if (!farmId) {
      throw new BadRequestError('Farm ID is required')
    }
    if (!isValidObjectId(farmId)) {
      throw new BadRequestError('Farm ID is invalid')
    }
    const farm = await getFarm(farmId)
    if (!farm) {
      throw new NotFoundError('Farm not found')
    }
    const deleteFarmbyId = await deleteFarm(farmId)
    if (!deleteFarmbyId) {
      throw new MethodFailureError('Delete farm failed')
    }
    return deleteFarmbyId
  }
}

module.exports = FarmService
