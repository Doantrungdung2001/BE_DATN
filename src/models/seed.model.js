'use strict'

const { Schema, model } = require('mongoose')
const slugify = require('slugify')

const DOCUMENT_NAME = 'Seed'
const COLLECTION_NAME = 'Seeds'

const seedSchema = new Schema(
  {
    plant: { type: Schema.Types.ObjectId, ref: 'Plant' },
    seed_name: { type: String, require: true },
    seed_thumb: { type: String, require: true },
    seed_description: { type: String, require: true },
    seed_slug: String,
    isSeedDefault: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

// createindex for search
seedSchema.index({ seed_name: 'text', seed_description: 'text' })

// Document middleware: run before .save() and .create()
seedSchema.pre('save', function (next) {
  this.seed_slug = slugify(this.seed_name, { lower: true })
  next()
})

module.exports = {
  seed: model(DOCUMENT_NAME, seedSchema)
}
