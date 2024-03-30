'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'ObjectDetection'
const COLLECTION_NAME = 'ObjectDetection'

const objectDetectionSchema = new Schema(
  {
    camera_id: { type: Schema.Types.ObjectId, ref: 'Camera' },
    start_time: Date,
    end_time: Date,
    video_url: String
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

module.exports = {
  objectDetection: model(DOCUMENT_NAME, objectDetectionSchema)
}
