// going to want to store name of file and timestamps but for now just want to store the url

const mongoose = require('mongoose')
// the timestamps on this model are going to provide us with the information we will need for created at and updated at
const uploadSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Upload', uploadSchema)
