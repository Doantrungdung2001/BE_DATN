'use strict'

const farmModel = require('../models/farm.model')

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

module.exports = {
  findByEmail
}
