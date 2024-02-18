'use strict'
const { Types } = require('mongoose')
const { findByEmail, getFarm, updateFarm } = require('../models/repositories/farm.repo')
const { BadRequestError } = require('../core/error.response')
const { removeUndefinedObject, isValidObjectId } = require('../utils')

class FarmService {
  static async findByEmail({ email }) {
    if (!email) {
      throw new BadRequestError('Email is required')
    }
    return await findByEmail({ email })
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

    const { name, description, status, district, address, images, lat, lng, phone, avatar, email } = farm

    return await updateFarm({
      farmId,
      famrInfo: removeUndefinedObject({
        name,
        description,
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
}

module.exports = FarmService
