'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'PlantFarming'
const COLLECTION_NAME = 'PlantFarmings'

const timeCultivate = new Schema({
  start: Number,
  end: Number
})

const cultivationActivity = new Schema({
  name: String,
  description: String
})

const fertilizationActivity = new Schema({
  fertilizationTime: String,
  type: {
    type: String,
    enum: ['baseFertilizer', 'topFertilizer'],
    default: 'baseFertilizer'
  },
  description: String
})

const pestAndDiseaseControlActivity = new Schema({
  name: String,
  type: {
    type: String,
    enum: ['pest', 'disease']
  },
  symptoms: String,
  description: String,
  solution: [String],
  note: String
})

const historyPlantFarmingEdit = new Schema({
  timeCultivates: [timeCultivate],
  cultivationActivities: [cultivationActivity],
  plantingActivity: {
    density: String,
    description: String
  },
  fertilizationActivities: [fertilizationActivity],
  pestAndDiseaseControlActivities: [pestAndDiseaseControlActivity],
  bestTimeCultivate: {
    start: Number,
    end: Number
  },
  farmingTime: Number,
  harvestTime: Number,
  isPlantFarmingDefault: { type: Boolean, default: false },
  modifiedAt: Date,
  createdAtTime: Date
})

const plantFarmingSchema = new Schema(
  {
    plant: { type: Schema.Types.ObjectId, ref: 'Plant' },
    seed: { type: Schema.Types.ObjectId, ref: 'Seed' },
    timeCultivates: [timeCultivate],
    cultivationActivities: [cultivationActivity],
    plantingActivity: {
      density: String,
      description: String
    },
    fertilizationActivities: [fertilizationActivity],
    pestAndDiseaseControlActivities: [pestAndDiseaseControlActivity],
    bestTimeCultivate: {
      start: Number,
      end: Number
    },
    farmingTime: Number,
    harvestTime: Number,
    isPlantFarmingDefault: { type: Boolean, default: false },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date,
    isEdited: {
      type: Boolean,
      default: false
    },
    createdAtTime: Date,
    historyPlantFarmingEdit: [historyPlantFarmingEdit],
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

module.exports = {
  plantFarming: model(DOCUMENT_NAME, plantFarmingSchema)
}
