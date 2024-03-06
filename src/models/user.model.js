'use strict'

const { Schema, model } = require('mongoose')
const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      require: true
    },
    roles: {
      type: Array,
      default: []
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

module.exports = {
  user: model(DOCUMENT_NAME, userSchema)
}
