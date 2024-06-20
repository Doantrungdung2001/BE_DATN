const { Types } = require('mongoose')
const { getClientById, getAllClients, updateClient, deleteClient } = require('../models/repositories/client.repo')
const { getUser } = require('./user.service')
const { MethodFailureError, BadRequestError, NotFoundError } = require('../core/error.response')
const { isValidObjectId } = require('../utils')

class ClientService {
  static async getClientById({ clientId }) {
    if (!clientId) throw new BadRequestError('Client id is required')
    if (!isValidObjectId(clientId)) {
      throw new BadRequestError('Invalid client id')
    }

    const foundClient = await getClientById({ clientId })
    // if (!foundClient) {
    //   throw new NotFoundError('Client not found')
    // }
    if (foundClient) {
      const user = await getUser({ userId: clientId });
      if (user && user.email) {
        foundClient.email = user.email;
      } else {
        throw new NotFoundError('Email not found for user');
      }
    }

    return foundClient
  }

  static async getAllClients() {
    return await getAllClients()
  }

  static async updateClient({ clientId, data }) {
    if (!clientId) throw new BadRequestError('Client id is required')
    if (!isValidObjectId(clientId)) {
      throw new BadRequestError('Invalid client id')
    }

    const updatedClient = await updateClient({ clientId, data })
    if (!updatedClient) {
      throw new MethodFailureError('Failed to update client')
    }

    return updatedClient
  }

  static async deleteClient({ clientId }) {
    if (!clientId) throw new BadRequestError('Client id is required')
    if (!isValidObjectId(clientId)) {
      throw new BadRequestError('Invalid client id')
    }

    const deletedClient = await deleteClient({ clientId })
    return deletedClient
  }
}

module.exports = ClientService
