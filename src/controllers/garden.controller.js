'use strict'

const GardenService = require('../services/garden.service')
const { SuccessResponse } = require('../core/success.response')

class GardenController {
  // create Garden
  createGarden = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Garden success!',
      metadata: await GardenService.createGarden({
        gardenData: req.body,
        farmId: req.user.userId
      })
    }).send(res)
  }

  // update Garden status
  updateGardenStatus = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Garden status success!',
      metadata: await GardenService.updateGardenStatus({
        gardenId: req.params.gardenId,
        status: req.body.status
      })
    }).send(res)
  }

  // add Delivery
  addDelivery = async (req, res, next) => {
    new SuccessResponse({
      message: 'Add Delivery success!',
      metadata: await GardenService.addDelivery({
        gardenId: req.params.gardenId,
        deliveryData: req.body
      })
    }).send(res)
  }

  // update Delivery
  updateDelivery = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Delivery success!',
      metadata: await GardenService.updateDelivery({
        gardenId: req.params.gardenId,
        deliveryId: req.params.deliveryId,
        deliveryData: req.body
      })
    }).send(res)
  }

  // delete Delivery
  deleteDelivery = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete Delivery success!',
      metadata: await GardenService.deleteDelivery({
        gardenId: req.params.gardenId,
        deliveryId: req.params.deliveryId
      })
    }).send(res)
  }

  // add client request
  addClientRequest = async (req, res, next) => {
    new SuccessResponse({
      message: 'Add ClientRequest success!',
      metadata: await GardenService.addClientRequest({
        gardenId: req.params.gardenId,
        clientRequestData: req.body
      })
    }).send(res)
  }

  // update client request
  updateClientRequest = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update ClientRequest success!',
      metadata: await GardenService.updateClientRequest({
        gardenId: req.params.gardenId,
        clientRequestId: req.params.clientRequestId,
        clientRequestData: req.body
      })
    }).send(res)
  }

  // delete client request
  deleteClientRequest = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete ClientRequest success!',
      metadata: await GardenService.deleteClientRequest({
        gardenId: req.params.gardenId,
        clientRequestId: req.params.clientRequestId
      })
    }).send(res)
  }

  // QUERY //

  getAllGardensByFarm = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get list getAllGardensByFarm success!',
      metadata: await GardenService.getAllGardensByFarm({
        farmId: req.params.farmId,
        ...req.query
      })
    }).send(res)
  }

  getGardenById = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get Garden success!',
      metadata: await GardenService.getGardenById({
        gardenId: req.params.gardenId
      })
    }).send(res)
  }

  getProjectsInfoByGarden = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get ProjectsInfo success!',
      metadata: await GardenService.getProjectsInfoByGarden({
        gardenId: req.params.gardenId
      })
    }).send(res)
  }

  getProjectPlantFarmingByGarden = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get ProjectPlantFarming success!',
      metadata: await GardenService.getProjectPlantFarmingByGarden({
        gardenId: req.params.gardenId,
        projectId: req.params.projectId
      })
    }).send(res)
  }

  getProjectProcessByGarden = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get ProjectProcess success!',
      metadata: await GardenService.getProjectProcessByGarden({
        gardenId: req.params.gardenId,
        projectId: req.params.projectId
      })
    }).send(res)
  }

  getClientRequestsByGarden = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get ClientRequests success!',
      metadata: await GardenService.getClientRequestsByGarden({
        gardenId: req.params.gardenId
      })
    }).send(res)
  }

  getDeliveriesByGarden = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get Deliveries success!',
      metadata: await GardenService.getDeliveriesByGarden({
        gardenId: req.params.gardenId
      })
    }).send(res)
  }
}

module.exports = new GardenController()
