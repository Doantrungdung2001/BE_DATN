'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Client'
const COLLECTION_NAME = 'Clients'


const clientSchema = new Schema(
  {
    name: String,
    phone: String,
    address: String,
    email: String,
    map: Object,
    district: String,
    birthDate: Date,
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

module.exports = {
  client: model(DOCUMENT_NAME, clientSchema)
}
