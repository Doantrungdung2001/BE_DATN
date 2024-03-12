'use strict'

const { client } = require('../client.model')
const { Types } = require('mongoose')

const getClientById = async ({ clientId }) => {
  return await client.findOne({ _id: new Types.ObjectId(clientId) }).exec()
}

module.exports = {
  getClientById
}
