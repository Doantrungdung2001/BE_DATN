'use strict'

const { Schema, model } = require('mongoose')
const { default: slugify } = require('slugify')

const DOCUMENT_NAME = 'Farm'
const COLLECTION_NAME = 'Farms'

const farmSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    phone: [String],
    email: [String],
    description: {
      type: String
    },
    name_slug: {
      type: String
    },
    images: [String],
    cameraId: {
      type: String
    },
    district: {
      type: String
    },
    address: {
      type: String
    },
    lat: {
      type: Number
    },
    lng: {
      type: Number
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

// createindex for search
farmSchema.index({ name: 'text', description: 'text' })

// Document middleware: run before .save() and .create()
farmSchema.pre('save', function (next) {
  this.name_slug = slugify(this.name, { lower: true })
  next()
})

module.exports = {
  farm: model(DOCUMENT_NAME, farmSchema)
}
