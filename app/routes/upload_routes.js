const express = require('express')
const Upload = require('../models/upload')
const router = express.Router()

router.post('/uploads', (req, res, next) => {
  // this is basically sending an upload object with key of URL and value of a url for example google
  Upload.create(req.body.upload)
    .then(upload => {
      res.status(201).json({upload})
    })
})
// once route is created need to require in server.js
// we have to also define with we use the routes with app.use down in the server.js file as well

module.exports = router
