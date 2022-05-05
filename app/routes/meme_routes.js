const express = require('express')
const passport = require('passport')
const Meme = require('../models/meme')
const router = express.Router()
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const s3Upload = require('../../lib/s3_upload')

const requireToken = passport.authenticate('bearer', { session: false })
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
// const removeBlanks = require('../../lib/remove_blank_fields')
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

router.post('/uploads', upload.single('upload'), requireToken, (req, res, next) => {
  console.log(req.file)
  s3Upload(req.file)
    .then(awsFile => {
      return Meme.create({ url: awsFile.Location, owner: req.user.id, name: req.body.name, author: req.user.email })
    })
    .then((upload) => {
      console.log(req.body.name)
      res.status(201).json({ upload })
    })
    .catch(next)
})
// Index all users
router.get('/uploads/all', requireToken, (req, res, next) => {
  Meme.find()
    .then((uploads) => res.json({ uploads: uploads }))
    .then((uploads) => res.status(200).json({ uploads: uploads }))
    .catch(next)
})

// INDEX SINGLE USER
router.get('/uploads', requireToken, (req, res, next) => {
  Meme.find({ owner: req.user._id })
    .then((uploads) => {
      return uploads.map((upload) => upload.toObject())
    })
  // respond with status 200 and JSON of the examples
    .then((uploads) => res.status(200).json({ uploads: uploads }))
  // if an error occurs, pass it to the handler
    .catch(next)
})

router.delete('/uploads/:id', requireToken, (req, res, next) => {
  console.log(req.params.id)
  Meme.findById(req.params.id)
    .then(handle404)
    .then((upload) => {
      // throw an error if current user doesn't own `example`
      requireOwnership(req, upload)
      // delete the example ONLY IF the above didn't throw
      return upload.deleteOne()
    })
  // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
  // if an error occurs, pass it to the handler
    .catch(next)
})

// Show a single Meme
router.get('/uploads/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Meme.findById(req.params.id)
    .then(handle404)
    // if `findById` is successful, respond with 200 and "example" JSON
    .then(upload => res.status(200).json({ upload: upload.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})
// upload.none allows for multer to send the information on the body
router.patch('/uploads/:id', upload.none(), requireToken, (req, res, next) => {
  // get id of event from params
  const id = req.params.id
  // get event data from request
  const eventData = req.body.upload
  // fetching event by its id
  Meme.findById(id)
    // handle 404 error if no event found
    .then(handle404)
    .then(event => requireOwnership(req, event))
    // update event
    .then(event => {
      console.log(eventData)
      // updating event object
      // // with eventData
      Object.assign(event, eventData)
      // save event to mongodb
      return event.save()
    })
    // if successful return 204
    .then(() => res.sendStatus(204))
    // on error go to next middleware
    .catch(next)
})

module.exports = router
