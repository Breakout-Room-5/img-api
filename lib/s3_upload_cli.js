// this is where we require in the dotenv, there are notes on dot env in the .env file we created
require('dotenv').config()
// create s3 instance
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
console.log(s3)
// upload method params are initially nothing and there are some optional arguments and call back Bucket name, key, and body
// body can be a string or a stream is the example given in AWS documentation
// bucket can be a string only
// object key for which the put operation was initiated given example looks like file name

const uploadParams = {
  Bucket: 'image-bucket-big-yoshi',
  Key: 'filename.txt',
  Body: 'Hello world'
}

s3.upload(uploadParams, function (err, data) {
  console.log(err, data)
})
// setting credentials in node.js, there are several ways to supply credentials to the sdk, can load from shared credentials file, environment variables, json file
// the example uses this with .env files from environment variables, The environment variable names
