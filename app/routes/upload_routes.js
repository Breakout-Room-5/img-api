const express = require('express')
const passport = require('passport')
const Upload = require('../models/upload')
const router = express.Router()
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const s3Upload = require('../../lib/s3_upload')

const requireToken = passport.authenticate('bearer', { session: false })
router.post('/uploads', upload.single('upload'), requireToken, (req, res, next) => {
  console.log(req.file)
  s3Upload(req.file)
    .then(awsFile => {
      return Upload.create({ url: awsFile.Location, owner: req.user.id, name: req.body.name })
    })
    // .then(req => {
    //   return Upload.create({owner: req.user.id})
    // })
    .then((upload) => {
      console.log(req.file.originalname)
      res.status(201).json({ upload })
    })
    .catch(next)
})

module.exports = router
