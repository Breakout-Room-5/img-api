const express = require('express')
const Upload = require('../models/upload')
const router = express.Router()
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const s3Upload = require('../../lib/s3_upload')

router.post('/uploads', upload.single('upload'), (req, res, next) => {
  s3Upload(req.file)
    .then(awsFile => {
      return Upload.create({url: awsFile.Location})
    })
    .then((upload) => {
      res.status(201).json({ upload })
    })
    .catch(next)
})

module.exports = router
