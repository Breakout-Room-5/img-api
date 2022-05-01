// this is where we require in the dotenv, there are notes on dot env in the .env file we created
require('dotenv').config()
// create s3 instance
// fs.readfile works by taking in a path and using a callback
const fs = require('fs')
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const fileName = process.argv[2]
console.log(s3)
// upload method params are initially nothing and there are some optional arguments and call back Bucket name, key, and body
// body can be a string or a stream is the example given in AWS documentation
// bucket can be a string only
// object key for which the put operation was initiated given example looks like file name

// returns a new promise that reads the file that is the path
const readFilePromise = function (path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, function (err, data) {
      if (err) reject(err)
      resolve(data)
    })
  })
}

const uploadParams = {
  Bucket: 'image-bucket-big-yoshi',
  Key: fileName
}
// this invokes the readfile promise function passes in the name of the file
readFilePromise(fileName)
  .then(data => {
    uploadParams.Body = data
    s3.upload(uploadParams, function (err, data) {
      console.log(err, data)
    })
  })
  .catch(console.error)

// setting credentials in node.js, there are several ways to supply credentials to the sdk, can load from shared credentials file, environment variables, json file
// the example uses this with .env files from environment variables, The environment variable names
