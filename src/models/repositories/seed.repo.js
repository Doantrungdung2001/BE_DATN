'use strict'

const { seed } = require('../../models/seed.model')
const { Types } = require('mongoose')
const { getSelectData, unGetSelectData } = require('../../utils/index')
const { plant } = require('../plant.model')
const { MethodFailureError, NotFoundError } = require('../../core/error.response')

const searchSeedByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch)
  const result = await seed
    .find(
      {
        $text: { $search: regexSearch }
      },
      { score: { $meta: 'textScore' } }
    )
    .populate('plant')
    .sort({ score: { $meta: 'textScore' } })
    .lean()
    .exec()
  return result
}

const getAllSeedsByFarm = async ({ limit, sort, page, filter } = {}) => {
  let query = seed.find(filter || {}).populate('plant')

  if (sort) {
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    query = query.sort(sortBy)
  }

  if (page && limit) {
    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)
  }

  const seeds = await query.lean().exec()
  return seeds
}

const getSeedBySeedId = async ({ seedId }, unSelect = ['__v']) => {
  return await seed.findById(seedId).populate('plant').select(unGetSelectData(unSelect)).lean().exec()
}

const getSeedByPlantInFarm = async ({ plantId }) => {
  const seeds = await seed
    .find({ plant: new Types.ObjectId(plantId) })
    .populate('plant')
    .lean()
    .exec()
  return seeds
}

const addSeed = async ({ seedData, plantId }) => {
  return await seed.create({
    plant: new Types.ObjectId(plantId),
    ...seedData
  })
}

const updateSeed = async ({ seedId, bodyUpdate }) => {
  return await seed.findByIdAndUpdate(seedId, bodyUpdate, { new: true }).exec()
}

const deleteSeed = async (seedId) => {
  return await seed.findByIdAndDelete(seedId).exec()
}

module.exports = {
  searchSeedByUser,
  getAllSeedsByFarm,
  getSeedBySeedId,
  getSeedByPlantInFarm,
  updateSeed,
  addSeed,
  deleteSeed
}
