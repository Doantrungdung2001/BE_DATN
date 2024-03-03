'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'ObjectDetection'
const COLLECTION_NAME = 'ObjectDetections'

const objectDetectionSchema = new Schema(
  {
    camera: { type: Schema.Types.ObjectId, ref: 'Camera' },
    start: Date,
    end: Date
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

module.exports = {
  objectDetection: model(DOCUMENT_NAME, objectDetectionSchema)
}
