'use strict'

const GardenService = require('../services/garden.service')
const { SuccessResponse } = require('../core/success.response')

class GardenController {
  // add new project to garden
  addNewProjectToGarden = async (req, res, next) => {
    new SuccessResponse({
      message: 'Add new project to garden success!',
      metadata: await GardenService.addNewProjectToGarden({
        farmId: req.user.userId,
        gardenId: req.params.gardenId,
        plantId: req.body.plantId,
        seedId: req.body.seedId,
        startDate: req.body.startDate
      })
    }).send(res)
  }

  // delete farmer
  deleteGarden = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete Garden success!',
      metadata: await GardenService.deleteGarden({
        farmId: req.user.userId,
        gardenId: req.params.gardenId
      })
    }).send(res)
  }

  // delete client
  deleteGardenbyClient = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete Garden success by Client!',
      metadata: await GardenService.deleteGardenbyClient({
        clientId: req.user.userId,
        gardenId: req.params.gardenId
      })
    }).send(res)
  }

  // update Garden status
  updateGardenStatus = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Garden status success!',
      metadata: await GardenService.updateGardenStatus({
        farmId: req.user.userId,
        gardenId: req.params.gardenId,
        status: req.body.status
      })
    }).send(res)
  }

  updateGardenStatusbyClient = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Garden status by Client success!',
      metadata: await GardenService.updateGardenStatusbyClient({
        clientId: req.user.userId,
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
        farmId: req.user.userId,
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
        farmId: req.user.userId,
        gardenId: req.params.gardenId,
        deliveryId: req.params.deliveryId,
        deliveryData: req.body
      })
    }).send(res)
  }

  updateDeliverybyClient = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Delivery success!',
      metadata: await GardenService.updateDeliverybyClient({
        clientId: req.user.userId,
        gardenId: req.params.gardenId,
        deliveryId: req.params.deliveryId,
        status: req.body.status
      })
    }).send(res)
  }

  // delete Delivery
  deleteDelivery = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete Delivery success!',
      metadata: await GardenService.deleteDelivery({
        farmId: req.user.userId,
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
        clientId: req.user.userId,
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
        farmId: req.user.userId,
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
        farmId: req.user.userId,
        gardenId: req.params.gardenId,
        clientRequestId: req.params.clientRequestId
      })
    }).send(res)
  }

  // update camera to garden
  updateCameraToGarden = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Camera success!',
      metadata: await GardenService.updateCameraToGarden({
        gardenId: req.params.gardenId,
        cameraId: req.body.cameraId
      })
    }).send(res)
  }

  // QUERY //

  getAllGardensByClient = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get list getAllGardenByClient success!',
      metadata: await GardenService.getAllGardenByClient({
        clientId: req.params.clientId,
        ...req.query
      })
    }).send(res)
  }
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

  getProjectsPlantFarmingByGarden = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get getProjectsPlantFarmingByGarden success!',
      metadata: await GardenService.getProjectsPlantFarmingByGarden({
        gardenId: req.params.gardenId
      })
    }).send(res)
  }

  getProjectsProcessByGarden = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get getProjectsProcessByGarden success!',
      metadata: await GardenService.getProjectsProcessByGarden({
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

  getDeliveriesByClient = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get All Deliveries by Client success!',
      metadata: await GardenService.getAllDeliveriesByClient({
        clientId: req.params.clientId,
        ...req.query
      })
    }).send(res)
  }

  getCameraInGarden = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get Camera success!',
      metadata: await GardenService.getCameraInGarden({
        gardenId: req.params.gardenId
      })
    }).send(res)
  }

  getObjectsDetectionByGardenId = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get ObjectsDetection success!',
      metadata: await GardenService.getObjectsDetectionByGardenId({
        gardenId: req.params.gardenId
      })
    }).send(res)
  }
}

module.exports = new GardenController()
