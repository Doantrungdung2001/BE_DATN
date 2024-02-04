const farm = require('../models/farm.model')
const { Types } = require('mongoose')

const getFarm = async ({ farmId }) => {
  const foundFarm = await farm
    .findOne({
      _id: new Types.ObjectId(farmId)
    })
    .exec()

  return foundFarm
}

module.exports = {
  getFarm
}
