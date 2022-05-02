const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    upload: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Upload',
      required: true

    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('MemePost', postSchema)
