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

const findAllSeeds = async ({ limit, sort, page, filter } = {}) => {
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

const findSeedBySeedId = async ({ seedId }, unSelect = ['__v']) => {
  const seedItem = await seed.findById(seedId).populate('plant').select(unGetSelectData(unSelect)).lean().exec()
  if (!seedItem) {
    throw new NotFoundError('Seed not found')
  }
  return seedItem
}

const getSeedByPlantInFarm = async ({ plantId }) => {
  const seeds = await seed
    .find({ plant: new Types.ObjectId(plantId) })
    .populate('plant')
    .lean()
    .exec()
  return seeds
}

const addSeed = async ({ seedData, farmId, plantId }) => {
  const createdSeed = await seed.create({
    plant: new Types.ObjectId(plantId),
    ...seedData,
    farm: new Types.ObjectId(farmId)
  })
  if (!createdSeed) {
    throw new MethodFailureError('Create seed failed')
  }
  return createdSeed
}

const updateSeed = async ({ seedId, bodyUpdate }) => {
  const updateSeedItem = await seed.findByIdAndUpdate(seedId, bodyUpdate, { new: true }).exec()
  if (!updateSeedItem) {
    throw new MethodFailureError('Update seed failed')
  }
  return updateSeedItem
}

const deleteSeed = async (seedId) => {
  const deletedSeed = await seed.findByIdAndDelete(seedId).exec()
  if (!deletedSeed) {
    throw new MethodFailureError('Delete seed failed')
  }
  return deletedSeed
}

module.exports = {
  searchSeedByUser,
  findAllSeeds,
  findSeedBySeedId,
  getSeedByPlantInFarm,
  updateSeed,
  addSeed,
  deleteSeed
}
