// // we installed an npm package called multer with command npm install multer this allows us to store files on the body, One option for sending files with the body is buffer, this will allow us to send files as buffer
// const express = require('express')
// // we are importing the npm package multer that we installed
// const multer = require('multer')
// const storage = multer.memoryStorage()
// // they use the upload variable and there are different methods there is upload.fields, upload.array, upload.single accepts a single image and name
// const upload = multer({ storage: storage })
// const Upload = require('../models/upload')
// const router = express.Router()

// const s3Upload = require('../../lib/s3_upload')

// // Create route for an upload
// // multer will add body and files object
// // Are we going to have to require token in this route or that won't work because the way we connect to AWS?
// router.post('/uploads', upload.single('upload'), (req, res, next) => {
//   console.log(req.body, req.file)
//   s3Upload(req.file)
//     .then(awsFile => {
//       return Upload.create({ url: awsFile.Location })
//     })
//   // this is basically sending an upload object with key of URL and value of a url for example google
//     .then(uploadDoc => {
//       res.status(201).json({upload: uploadDoc})
//     })
// })
// // once route is created need to require in server.js
// // we have to also define with we use the routes with app.use down in the server.js file as well

// module.exports = router
