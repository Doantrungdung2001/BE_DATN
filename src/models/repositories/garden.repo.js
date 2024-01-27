'use strict'

const { garden } = require('../models/garden.model')
const { Types } = require('mongoose')
const { getSelectData, unGetSelectData } = require('../../utils/index')

const getAllGardensByFarm = async ({ limit, sort, page, filter } = {}) => {
  let query = garden
    .find(filter || {})
    .populate('farm')
    .populate('client')
    .populate('gardenServiceTemplate')
    .populate('gardenServiceRequest')

  if (sort) {
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    query = query.sort(sortBy)
  }

  if (page && limit) {
    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)
  }

  const gardens = await query.lean().exec()
  return gardens
}

const getGardenById = async ({ garden_id }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(garden_id)
    })
    .populate('farm')
    .populate('client')
    .populate('gardenServiceTemplate')
    .populate('gardenServiceRequest')
    .exec()

  return foundGarden
}

const getProjectsInfoByGarden = async ({ garden_id }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(garden_id)
    })
    .populate({
      path: 'projects',
      populate: { path: 'plant' },
      populate: { path: 'seed' },
      select: '_id plant seed startDate status'
    })
    .exec()

  return foundGarden.projects
}

const getProjectPlantFarmingByGarden = async ({ garden_id }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(garden_id)
    })
    .populate({
      path: 'projects',
      populate: {
        path: 'plantFarming'
      }
    })
    .exec()

  return foundGarden.projects
}

const getProjectProcessByGarden = async ({ garden_id }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(garden_id)
    })
    .populate({
      path: 'projects',
      select: 'process'
    })
    .exec()

  return foundGarden.projects
}

const getClientRequestsByGarden = async ({ garden_id }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(garden_id)
    })
    .populate({
      path: 'clientRequests',
      populate: { path: 'newPlant' },
      populate: { path: 'deliveryDetails.plant' }
    })
    .exec()

  return foundGarden.clientRequests
}

const getDeliveriesByGarden = async ({ garden_id }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(garden_id)
    })
    .populate({
      path: 'deliveries',
      populate: { path: 'deliveryDetails.plant' }
    })
    .exec()

  return foundGarden.deliveries
}

const createGarden = async ({
  farmId,
  clientId,
  projectIds,
  gardenServiceTemplateId,
  gardenServiceRequestId,
  note,
  startDate,
  status
}) => {
  const newGarden = new garden({
    farm: new Types.ObjectId(farmId),
    client: new Types.ObjectId(clientId),
    projects: projectIds.map((projectId) => new Types.ObjectId(projectId)),
    gardenServiceTemplate: new Types.ObjectId(gardenServiceTemplateId),
    gardenServiceRequest: new Types.ObjectId(gardenServiceRequestId),
    note,
    startDate,
    status
  })

  const createdGarden = await newGarden.save()
  return createdGarden
}

const updateGardenStatus = async ({ garden_id, status }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(garden_id)
    })
    .exec()

  if (!foundGarden) return null
  foundGarden.status = status

  await foundGarden.save()

  return foundGarden
}

const addDelivery = async ({ garden_id, deliveryDetails, note, status }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(garden_id)
    })
    .exec()
  if (!foundGarden) return null

  const formattedDeliveryDetails = deliveryDetails.map((detail) => ({
    ...detail,
    plant: new Types.ObjectId(detail.plant)
  }))

  foundGarden.deliveries.push({
    time: new Date(),
    deliveryDetails: formattedDeliveryDetails,
    note,
    status
  })

  await foundGarden.save()

  return foundGarden.deliveries
}

const updateDelivery = async ({ garden_id, delivery_id, deliveryDetails, note, status }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(garden_id)
    })
    .exec()
  if (!foundGarden) return null

  const foundDelivery = foundGarden.deliveries.find((delivery) => delivery._id.toString() === delivery_id)
  if (!foundDelivery) return null

  if (deliveryDetails) {
    const formattedDeliveryDetails = deliveryDetails.map((detail) => ({
      ...detail,
      plant: new Types.ObjectId(detail.plant)
    }))
    foundDelivery.deliveryDetails = formattedDeliveryDetails
  }

  if (note) {
    foundDelivery.note = note
  }

  if (status) {
    foundDelivery.status = status
  }

  await foundGarden.save()

  return foundDelivery
}

const deleteDelivery = async ({ garden_id, delivery_id }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(garden_id)
    })
    .exec()
  if (!foundGarden) return null

  const foundDeliveryIndex = foundGarden.deliveries.findIndex((delivery) => delivery._id.toString() === delivery_id)
  if (foundDeliveryIndex === -1) return null

  foundGarden.deliveries.splice(foundDeliveryIndex, 1)

  const modifiedCount = await foundGarden.save()

  return modifiedCount
}

const addClientRequest = async ({ garden_id, type, newPlant, deliveryDetails, note }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(garden_id)
    })
    .exec()
  if (!foundGarden) return null

  const formattedDeliveryDetails = deliveryDetails.map((detail) => ({
    ...detail,
    plant: new Types.ObjectId(detail.plant)
  }))

  foundGarden.clientRequests.push({
    time: new Date(),
    type,
    newPlant: new Types.ObjectId(newPlant),
    deliveryDetails: formattedDeliveryDetails,
    note
  })

  await foundGarden.save()

  return foundGarden.clientRequests
}

const updateClientRequest = async ({ garden_id, clientRequest_id, type, newPlant, deliveryDetails, note }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(garden_id)
    })
    .exec()
  if (!foundGarden) return null

  const foundClientRequest = foundGarden.clientRequests.find(
    (clientRequest) => clientRequest._id.toString() === clientRequest_id
  )
  if (!foundClientRequest) return null

  if (type) {
    foundClientRequest.type = type
  }

  if (newPlant) {
    foundClientRequest.newPlant = new Types.ObjectId(newPlant)
  }

  if (deliveryDetails) {
    const formattedDeliveryDetails = deliveryDetails.map((detail) => ({
      ...detail,
      plant: new Types.ObjectId(detail.plant)
    }))
    foundClientRequest.deliveryDetails = formattedDeliveryDetails
  }

  if (note) {
    foundClientRequest.note = note
  }

  await foundGarden.save()

  return foundClientRequest
}

const deleteClientRequest = async ({ garden_id, clientRequest_id }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(garden_id)
    })
    .exec()
  if (!foundGarden) return null

  const foundClientRequestIndex = foundGarden.clientRequests.findIndex(
    (clientRequest) => clientRequest._id.toString() === clientRequest_id
  )
  if (foundClientRequestIndex === -1) return null

  foundGarden.clientRequests.splice(foundClientRequestIndex, 1)

  const modifiedCount = await foundGarden.save()

  return modifiedCount
}

module.exports = {
  getAllGardensByFarm,
  getGardenById,
  getProjectsInfoByGarden,
  getProjectPlantFarmingByGarden,
  getProjectProcessByGarden,
  getClientRequestsByGarden,
  getDeliveriesByGarden,
  createGarden,
  updateGardenStatus,
  addDelivery,
  updateDelivery,
  deleteDelivery,
  addClientRequest,
  updateClientRequest,
  deleteClientRequest
}
