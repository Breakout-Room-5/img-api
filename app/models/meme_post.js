// NOT USING THIS FILE

const mongoose = require('mongoose')

const uploadSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  }
})

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
    upload: [uploadSchema]
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('MemePost', postSchema)
