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
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// All User INDEX
// GET /examples
router.get('/home', requireToken, (req, res, next) => {
  MemePost.find()
    .then((memes) => {
      // `examples` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return memes.map((meme) => meme.toObject())
    })
  // respond with status 200 and JSON of the examples
    .then((memes) => res.status(200).json({ memes: memes }))
  // if an error occurs, pass it to the handler
    .catch(next)
})
// Index of a single user
router.get('/memes', requireToken, (req, res, next) => {
  MemePost.find({ owner: req.user.id })
    .then((memes) => {
      // `examples` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return memes.map((meme) => meme.toObject())
    })
  // respond with status 200 and JSON of the examples
    .then((memes) => res.status(200).json({ memes: memes }))
  // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /examples/5a7db6c74d55bc51bdf39793
// router.get('/memes/:id', requireToken, (req, res, next) => {
//   // req.params.id will be set based on the `:id` in the route
//   MemePost.findById({ owner: req.user._id })
//     .then(handle404)
//   // if `findById` is succesful, respond with 200 and "example" JSON
//     .then((example) => res.status(200).json({ example: example.toObject() }))
//   // if an error occurs, pass it to the handler
//     .catch(next)
// })

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

// UPDATE
// PATCH /examples/5a7db6c74d55bc51bdf39793
router.patch('/memes/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.meme.owner
  const memeId = req.params.id
  const memeData = req.body.meme

  MemePost.findById(memeId)
    .then(handle404)
    .then((meme) => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, meme)

      // pass the result of Mongoose's `.update` to the next `.then`
      return meme.updateOne(memeData)
    })
  // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
  // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /examples/5a7db6c74d55bc51bdf39793
router.delete('/memes/:id', requireToken, (req, res, next) => {
  MemePost.findById(req.params.id)
    .then(handle404)
    .then((meme) => {
      // throw an error if current user doesn't own `example`
      requireOwnership(req, meme)
      // delete the example ONLY IF the above didn't throw
      meme.deleteOne()
    })
  // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
  // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
