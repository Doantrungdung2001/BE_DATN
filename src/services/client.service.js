const { Types } = require('mongoose')
const { getClientById } = require('../models/repositories/client.repo')
const { MethodFailureError, BadRequestError, NotFoundError } = require('../core/error.response')
const { isValidObjectId } = require('../utils')

class ClientService {
  static async getClientById({ clientId }) {
    if (!clientId) throw new BadRequestError('Client id is required')
    if (!isValidObjectId(clientId)) {
      throw new BadRequestError('Invalid client id')
    }

    const foundClient = await getClientById({ clientId })
    if (!foundClient) {
      throw new NotFoundError('Client not found')
    }

    return foundClient
  }
}

module.exports = ClientService
