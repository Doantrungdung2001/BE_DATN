'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Camera'
const COLLECTION_NAME = 'Cameras'

const cameraSchema = new Schema(
  {
    name: String,
    rtsp_link: String,
    farm: { type: Schema.Types.ObjectId, ref: 'Farm' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

module.exports = {
  camera: model(DOCUMENT_NAME, cameraSchema)
}
