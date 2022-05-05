// going to want to store name of file and timestamps but for now just want to store the url

const mongoose = require('mongoose')
// the timestamps on this model are going to provide us with the information we will need for created at and updated at
const memeSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  author: {
    type: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Meme', memeSchema)
