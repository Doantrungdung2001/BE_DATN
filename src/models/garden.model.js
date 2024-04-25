'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Garden'
const COLLECTION_NAME = 'Gardens'

const deliveryDetailSchema = new Schema({
  plant: { type: Schema.Types.ObjectId, ref: 'Plant' },
  amount: Number
})

const clientRequestSchema = new Schema({
  time: Date,
  type: {
    type: String,
    enum: ['newPlant', 'deliveryRequest', 'other'],
    default: 'other'
  },
  newPlant: { type: Schema.Types.ObjectId, ref: 'Plant' },
  deliveryDetails: [deliveryDetailSchema],
  note: String
})

const deliverySchema = new Schema({
  time: Date,
  deliveryDetails: [deliveryDetailSchema],
  note: String,
  status: {
    type: String,
    enum: ['coming', 'done', 'cancel'],
    default: 'coming'
  },
  clientAccept: Boolean,
  clientNote: String
})

const gardenSchema = new Schema(
  {
    farm: { type: Schema.Types.ObjectId, ref: 'Farm' },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    gardenServiceTemplate: { type: Schema.Types.ObjectId, ref: 'GardenServiceTemplate' },
    gardenServiceRequest: { type: Schema.Types.ObjectId, ref: 'GardenServiceRequest' },
    note: String,
    startDate: Date,
    clientRequests: [clientRequestSchema],
    deliveries: [deliverySchema],
    status: {
      type: String,
      enum: ['started', 'end', 'cancel'],
      default: 'started'
    },
    cameraIds: [{ type: Schema.Types.ObjectId, ref: 'Camera' }]
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

module.exports = {
  garden: model(DOCUMENT_NAME, gardenSchema)
}
