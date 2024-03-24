'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Event'
const COLLECTION_NAME = 'Events'

const eventSchema = new Schema(
  {
    walletAddress: String,
    fee: Number,
    timestamp: Date,
    event: String,
    tx: String
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

module.exports = {
  event: model(DOCUMENT_NAME, eventSchema)
}
