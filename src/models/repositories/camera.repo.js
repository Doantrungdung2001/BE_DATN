'use strict'

const { camera } = require('../../models/camera.model')
const { Types } = require('mongoose')
const { getSelectData, unGetSelectData } = require('../../utils/index')

const getAllCameras = async ({ limit, sort, page, filter } = {}) => {
  let query = camera.find(filter || {})

  if (sort) {
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    query = query.sort(sortBy)
  }

  if (page && limit) {
    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)
  }

  const cameras = await query.lean().exec()
  return cameras
}

const getCameraById = async ({ cameraId }) => {
  try {
    const foundCamera = await camera
      .findOne({
        _id: new Types.ObjectId(cameraId)
      })
      .exec();
    
    return foundCamera; // If found, return the camera document
  } catch (error) {
    console.error(`Error while retrieving camera: ${error.message}`);
    throw new NotFoundError('Camera not found'); // Throw custom NotFoundError if camera not found
  }
};

const addCamera = async ({ cameraData }) => {
  const newCamera = new camera(cameraData)
  const result = await newCamera.save()
  return result
}

const updateCamera = async ({ cameraId, cameraData }) => {
  const result = await camera.findByIdAndUpdate(cameraId, cameraData, { new: true }).lean().exec()
  return result
}

const deleteCamera = async ({ cameraId }) => {
  // const bodyUpdate = {
  //   isDeleted: true,
  //   deletedAt: new Date()
  // }
  // return await camera.findByIdAndUpdate(cameraId, bodyUpdate, { new: true }).exec()
  const deletedCamera = await camera.findByIdAndDelete(cameraId).exec()
  return deletedCamera
}

module.exports = {
  getAllCameras,
  getCameraById,
  addCamera,
  updateCamera,
  deleteCamera
}
