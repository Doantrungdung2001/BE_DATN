const { Types } = require('mongoose')
const { getAllDistributers, getDistributerById } = require('../models/repositories/distributer.repo')
const { MethodFailureError, BadRequestError, NotFoundError } = require('../core/error.response')
const { isValidObjectId } = require('../utils')

class DistributerService {
  static async getAllDistributers({ limit, sort, page } = {}) {
    const filter = {}
    const distributers = await getAllDistributers({ limit, sort, page, filter })
    return distributers
  }

  static async getDistributerById({ distributerId }) {
    if (!distributerId) throw new BadRequestError('Distributer id is required')
    if (!isValidObjectId(distributerId)) {
      throw new BadRequestError('Invalid distributer id')
    }

    const foundDistributer = await getDistributerById({ distributerId })
    if (!foundDistributer) {
      throw new NotFoundError('Distributer not found')
    }

    return foundDistributer
  }
}

module.exports = DistributerService
