// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const Upload = require('../models/upload')
// pull in Mongoose model for examples
const MemePost = require('../models/meme_post')

const s3Upload = require('../../lib/s3_upload')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
// const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
// const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
// const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
// const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// CREATE
// POST /examples
router.post('/memes', requireToken, upload.single('upload'), (req, res, next) => {
  // set owner of new example to be current user
  const file = req.file
  console.log(req.body)
  req.body.owner = req.user.id
  console.log(file)
  s3Upload(file)
    .then((awsFile) => {
      return Upload.create({ url: awsFile.Location })
    })
    .then((upload) => {
      req.body.meme.upload = upload._id
      MemePost.create(req.body.meme)
    })
    .then((meme) => {
      res.status(201).json({ meme: meme.toObject() })
    })
    .catch(next)
})

module.exports = router
