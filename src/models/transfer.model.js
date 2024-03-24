'use strict'

const { Schema, model } = require('mongoose')
const DOCUMENT_NAME = 'Transfer'
const COLLECTION_NAME = 'Transfers'

const transferSchema = new Schema(
  {
    farm: { type: Schema.Types.ObjectId, ref: 'Farm' },
    tx: String,
    amount: Number,
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

module.exports = {
  transfer: model(DOCUMENT_NAME, transferSchema)
}
