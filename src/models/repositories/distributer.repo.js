'use strict'

const { distributer } = require('../../models/distributer.model')
const { Types } = require('mongoose')
const { getSelectData, unGetSelectData } = require('../../utils/index')

const getAllDistributers = async ({ limit, sort, page, filter } = {}) => {
  let query = distributer.find(filter || {})

  if (sort) {
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    query = query.sort(sortBy)
  }

  if (page && limit) {
    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)
  }

  const distributers = await query.lean().exec()
  return distributers
}

const getDistributerById = async ({ distributerId }) => {
  const foundDistributer = await distributer
    .findOne({
      _id: new Types.ObjectId(distributerId)
    })
    .exec()

  return foundDistributer
}

module.exports = {
  getAllDistributers,
  getDistributerById
}
