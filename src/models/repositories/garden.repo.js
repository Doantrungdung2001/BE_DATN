'use strict'

const { garden } = require('../../models/garden.model')
const { Types } = require('mongoose')
const { getSelectData, unGetSelectData } = require('../../utils/index')

const getAllGardensByFarm = async ({ limit, sort, page, filter } = {}) => {
  let query = garden
    .find(filter || {})
    .populate('farm')
    .populate('client')
    .populate('gardenServiceTemplate')
    .populate('gardenServiceRequest')
    .populate({
      path: 'gardenServiceRequest',
      populate: { path: 'herbList' }
    })
    .populate({
      path: 'gardenServiceRequest',
      populate: { path: 'leafyList' }
    })
    .populate({
      path: 'gardenServiceRequest',
      populate: { path: 'rootList' }
    })
    .populate({
      path: 'gardenServiceRequest',
      populate: { path: 'fruitList' }
    })

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

const getGardenById = async ({ gardenId }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(gardenId)
    })
    .populate('farm')
    .populate('client')
    .populate('gardenServiceTemplate')
    .populate({
      path: 'gardenServiceRequest',
      populate: [{ path: 'herbList' }, { path: 'leafyList' }, { path: 'rootList' }, { path: 'fruitList' }]
    })
    .populate('cameraIds')
    .exec()

  return foundGarden
}

const getProjectsInfoByGarden = async ({ gardenId }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(gardenId)
    })
    .populate({
      path: 'projects',
      populate: { path: 'plant' },
      select: '_id plant seed startDate status'
    })
    .populate({
      path: 'projects',
      populate: { path: 'seed' },
      select: '_id plant seed startDate status'
    })
    .exec()

  return foundGarden.projects
}

const getProjectPlantFarmingByGarden = async ({ gardenId }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(gardenId)
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

const getProjectProcessByGarden = async ({ gardenId }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(gardenId)
    })
    .populate({
      path: 'projects',
      select: 'process'
    })
    .exec()

  return foundGarden.projects
}

const getClientRequestsByGarden = async ({ gardenId }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(gardenId)
    })
    .populate({
      path: 'clientRequests',
      populate: { path: 'deliveryDetails.plant' }
    })
    .populate({
      path: 'clientRequests',
      populate: { path: 'newPlant' }
    })
    .exec()

  return foundGarden.clientRequests
}

const getDeliveriesByGarden = async ({ gardenId }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(gardenId)
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

const deleteGarden = async ({ gardenId }) => {
  const result = await garden.deleteOne({ _id: new Types.ObjectId(gardenId) }).exec()
  return result
}

const addNewProjectToGarden = async ({ gardenId, projectId }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(gardenId)
    })
    .exec()

  if (!foundGarden) return null

  foundGarden.projects.push(new Types.ObjectId(projectId))

  await foundGarden.save()

  return foundGarden
}

const updateGardenStatus = async ({ gardenId, status }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(gardenId)
    })
    .exec()

  if (!foundGarden) return null
  foundGarden.status = status

  await foundGarden.save()

  return foundGarden
}

const addDelivery = async ({ gardenId, formatDeliveryData }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(gardenId)
    })
    .exec()
  if (!foundGarden) return null

  foundGarden.deliveries.push(formatDeliveryData)

  await foundGarden.save()

  return foundGarden.deliveries
}

const updateDelivery = async ({ gardenId, deliveryId, deliveryDetails, note, status }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(gardenId)
    })
    .exec()
  if (!foundGarden) return null

  const foundDelivery = foundGarden.deliveries.find((delivery) => delivery._id.toString() === deliveryId)
  if (!foundDelivery) return null

  if (deliveryDetails && deliveryDetails.length > 0) {
    foundDelivery.deliveryDetails = deliveryDetails
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

const deleteDelivery = async ({ gardenId, deliveryId }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(gardenId)
    })
    .exec()
  if (!foundGarden) return null

  const foundDeliveryIndex = foundGarden.deliveries.findIndex((delivery) => delivery._id.toString() === deliveryId)
  if (foundDeliveryIndex === -1) return null

  foundGarden.deliveries.splice(foundDeliveryIndex, 1)

  const modifiedCount = await foundGarden.save()

  return modifiedCount
}

const addClientRequest = async ({ gardenId, formatClientRequestData }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(gardenId)
    })
    .exec()
  if (!foundGarden) return null

  foundGarden.clientRequests.push(formatClientRequestData)

  await foundGarden.save()

  return foundGarden.clientRequests
}

const updateClientRequest = async ({ gardenId, clientRequestId, type, newPlant, deliveryDetails, note }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(gardenId)
    })
    .exec()
  if (!foundGarden) return null

  const foundClientRequest = foundGarden.clientRequests.find(
    (clientRequest) => clientRequest._id.toString() === clientRequestId
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

const deleteClientRequest = async ({ gardenId, clientRequestId }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(gardenId)
    })
    .exec()
  if (!foundGarden) return null

  const foundClientRequestIndex = foundGarden.clientRequests.findIndex(
    (clientRequest) => clientRequest._id.toString() === clientRequestId
  )
  if (foundClientRequestIndex === -1) return null

  foundGarden.clientRequests.splice(foundClientRequestIndex, 1)

  const modifiedCount = await foundGarden.save()

  return modifiedCount
}

const updateCameraToGarden = async ({ gardenId, cameraId }) => {
  const foundGarden = await garden
    .findOne({
      _id: new Types.ObjectId(gardenId)
    })
    .exec()
  if (!foundGarden) return null

  foundGarden.cameraIds = cameraId.map((cameraIdItem) => new Types.ObjectId(cameraIdItem))

  await foundGarden.save()

  return foundGarden
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
  deleteGarden,
  addNewProjectToGarden,
  updateGardenStatus,
  addDelivery,
  updateDelivery,
  deleteDelivery,
  addClientRequest,
  updateClientRequest,
  deleteClientRequest,
  updateCameraToGarden
}
