'use strict'

const farmModel = require('../models/farm.model')
const { Types } = require('mongoose')

const findByEmail = async ({
  email,
  select = {
    email: 1,
    password: 2,
    name: 1,
    status: 1,
    roles: 1
  }
}) => {
  return await farmModel.findOne({ email }).select(select).lean().exec()
}

const getFarm = async ({ farmId }) => {
  const foundFarm = await farmModel
    .findOne({
      _id: new Types.ObjectId(farmId)
    })
    .exec()

  return {
    _id: foundFarm._id,
    name: foundFarm.name,
    email: foundFarm.email,
    roles: foundFarm.roles
  }
}

module.exports = {
  findByEmail,
  getFarm
}
