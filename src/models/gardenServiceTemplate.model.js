'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'GardenServiceTemplate'
const COLLECTION_NAME = 'GardenServiceTemplates'

const gardenServiceTemplateSchema = new Schema(
  {
    farm: { type: Schema.Types.ObjectId, ref: 'Farm' },
    quantity: Number,
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    square: Number,
    expectDeliveryPerWeek: Number,
    expectedOutput: Number,
    expectDeliveryAmount: Number,
    price: Number,
    herbMax: Number,
    leafyMax: Number,
    rootMax: Number,
    fruitMax: Number,
    avatarGarden: {
      type: String
    },
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
  gardenServiceTemplate: model(DOCUMENT_NAME, gardenServiceTemplateSchema)
}
