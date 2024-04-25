'use strict'

const { project } = require('../../models/project.model')
const { distributer } = require('../../models/distributer.model')
const { Types } = require('mongoose')
const { getSelectData, unGetSelectData } = require('../../utils/index')

const initProject = async ({ projectData, farmId, plantId, seedId, status }) => {
  return await project.create({
    ...projectData,
    farm: new Types.ObjectId(farmId),
    plant: new Types.ObjectId(plantId),
    seed: new Types.ObjectId(seedId),
    status
  })
}

const getProjectInfo = async ({ projectId, select }) => {
  const projectInfo = await project
    .findOne({ _id: new Types.ObjectId(projectId) })
    .populate('farm')
    .populate('plant')
    .populate('seed')
    .populate('historyInfo.seed')
    .populate('cameraId')
    .select(getSelectData(select))
    .lean()
    .exec()

  return projectInfo
}

const updateProjectInfo = async ({ projectId, projectData, historyInfoItem }) => {
  const projectItem = await project.findOne({ _id: new Types.ObjectId(projectId) })
  if (!projectItem) {
    return null
  }
  projectItem.isInfoEdited = true
  projectItem.historyInfo.push(historyInfoItem)
  await projectItem.save()
  const result = await project.updateOne({ _id: new Types.ObjectId(projectId) }, projectData).exec()

  return result
}

const deleteProject = async ({ projectId }) => {
  const result = await project.deleteOne({ _id: new Types.ObjectId(projectId) }).exec()

  return result
}

const getAllProcess = async ({ projectId }) => {
  const processes = await project
    .findOne({ _id: new Types.ObjectId(projectId) })
    .select(getSelectData(['process']))
    .lean()
    .exec()

  const filteredProcesses = processes.process.filter((process) => !process.isDeleted)
  return filteredProcesses
}

const addPlantFarmingToProject = async ({ projectId, plantFarmingId }) => {
  const result = await project
    .updateOne({ _id: new Types.ObjectId(projectId) }, { plantFarming: new Types.ObjectId(plantFarmingId) })
    .exec()

  return result
}

const addProcess = async ({ projectId, process }) => {
  const result = await project.updateOne({ _id: new Types.ObjectId(projectId) }, { $push: { process: process } }).exec()

  return result
}

const updateProcess = async ({ projectId, processId, newProcessData }) => {
  const projectItem = await project.findOne({ _id: new Types.ObjectId(projectId) })
  if (!projectItem) {
    return null
  }

  const process = projectItem.process.id(processId)
  if (!process) {
    return null
  }

  // Tạo một bản sao của quy trình trước khi chỉnh sửa
  const previousProcessData = { ...process.toObject() }
  delete previousProcessData._id // Xóa trường _id

  // Cập nhật quy trình với dữ liệu mới
  for (const key in newProcessData) {
    if (newProcessData.hasOwnProperty(key) && key !== 'historyProcess' && key != 'isEdited') {
      process[key] = newProcessData[key]
    }
  }

  // Xóa các trường không còn tồn tại trong dữ liệu mới
  for (const key in previousProcessData) {
    if (!newProcessData.hasOwnProperty(key) && key !== 'historyProcess' && key !== '_id' && key != 'isEdited') {
      delete process[key]
    }
  }

  // Đánh dấu quy trình đã được chỉnh sửa
  process.isEdited = true

  // Lưu lịch sử chỉnh sửa
  process.historyProcess.push({
    ...previousProcessData,
    modifiedAt: new Date()
  })

  // Lưu lại dự án với thông tin cập nhật
  await projectItem.save()
  return process
}

const deleteProcess = async ({ projectId, processId }) => {
  const result = await project
    .updateOne(
      { _id: new Types.ObjectId(projectId), 'process._id': new Types.ObjectId(processId) },
      {
        $set: { 'process.$.isDeleted': true, 'process.$.deletedAt': new Date() }
      }
    )
    .exec()

  return result
}

const getPlantFarmingId = async ({ projectId }) => {
  const projectInfo = await project
    .findOne({ _id: new Types.ObjectId(projectId) })
    .select('plantFarming')
    .lean()
    .exec()

  return projectInfo.plantFarming
}

module.exports = {
  initProject,
  getProjectInfo,
  updateProjectInfo,
  deleteProject,
  addPlantFarmingToProject,
  getAllProcess,
  addProcess,
  updateProcess,
  deleteProcess,
  getPlantFarmingId
}
