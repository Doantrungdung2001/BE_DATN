'use strict'

const { Schema, model } = require('mongoose')
const DOCUMENT_NAME = 'Weather'
const COLLECTION_NAME = 'Weathers'

const weatherSchema = new Schema(
  {
    district: {
      type: String,
      require: true
    },
    time: Date,
    description: String,
    temp: String,
    humidity: String,
    windSpeed: String
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

module.exports = {
  weather: model(DOCUMENT_NAME, weatherSchema)
}
