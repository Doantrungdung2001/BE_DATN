'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Project'
const COLLECTION_NAME = 'Projects'

const historyProcess = new Schema({
  time: Date,
  type: {
    type: String,
    enum: ['cultivation', 'planting', 'fertilize', 'pesticide', 'other']
  },
  cultivationActivity: {
    name: String,
    description: String
  },
  plantingActivity: {
    density: String,
    description: String
  },
  fertilizationActivity: {
    fertilizationTime: String,
    type: {
      type: String,
      enum: ['baseFertilizer', 'topFertilizer']
    },
    description: String
  },
  pestAndDiseaseControlActivity: {
    name: String,
    type: {
      type: String,
      enum: ['pest', 'disease']
    },
    symptoms: String,
    description: String,
    solution: [String],
    note: String
  },
  other: {
    description: String
  },
  modifiedAt: Date,
  createdAtTime: Date
})

const process = new Schema({
  time: Date,
  type: {
    type: String,
    enum: ['cultivation', 'planting', 'fertilize', 'pesticide', 'other']
  },
  isEdited: Boolean,
  cultivationActivity: {
    name: String,
    description: String
  },
  plantingActivity: {
    density: String,
    description: String
  },
  fertilizationActivity: {
    fertilizationTime: String,
    type: {
      type: String,
      enum: ['baseFertilizer', 'topFertilizer']
    },
    description: String
  },
  pestAndDiseaseControlActivity: {
    name: String,
    type: {
      type: String,
      enum: ['pest', 'disease']
    },
    symptoms: String,
    description: String,
    solution: [String],
    note: String
  },
  other: {
    description: String
  },
  historyProcess: [historyProcess],
  createdAtTime: Date,
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
})

const historyInfo = new Schema({
  createdAtTime: Date,
  seed: { type: Schema.Types.ObjectId, ref: 'Seed' },
  startDate: Date,
  modifiedAt: Date
})

const projectSchema = new Schema(
  {
    farm: { type: Schema.Types.ObjectId, ref: 'Farm' },
    plant: { type: Schema.Types.ObjectId, ref: 'Plant' },
    seed: { type: Schema.Types.ObjectId, ref: 'Seed' },
    startDate: Date,
    plantFarming: { type: Schema.Types.ObjectId, ref: 'PlantFarming' },
    process: [process],
    status: {
      type: String,
      enum: ['inProgress', 'harvesting', 'almostFinished', 'finished', 'cancel'],
      default: 'inProgress'
    },
    createdAtTime: Date,
    isInfoEdited: Boolean,
    historyInfo: [historyInfo]
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

module.exports = {
  project: model(DOCUMENT_NAME, projectSchema)
}
