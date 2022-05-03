// this is where we require in the dotenv, there are notes on dot env in the .env file we created
require('dotenv').config()
// create s3 instance
// fs.readfile works by taking in a path and using a callback
// const fs = require('fs')
const AWS = require('aws-sdk')
const s3 = new AWS.S3()

// we are going to read the file elsewhere and accept it here

module.exports = function (file) {
  const uploadParams = {
    Bucket: 'image-bucket-big-yoshi',
    // we need to make sure we have unique names so that they don't overwrite the previous ones, the solution for this is to maybe use dates, we can do this by adding a timestamp to key name, there are many ways to get new date
    // the plus new triggers the value method and returns the time stamp
    Key: +new Date() + '_' + file.originalname,
    Body: file.buffer,
    // in the future we may need to delete ACL and edit our bucket to remove ACL
    ACL: 'public-read',
    // ACL lets us set it so anyone can see the image but it does default to automatic download rather than view
    // content type is mime type multipurpose internet mail extension
    // AWS doesn't know how to display the image so we need to set the content type
    // the multer package that we are using to read files gives us the mimetype
    // ContentType is a parameter, AWS upload needs content type to be able to show image in browser
    ContentType: file.mimetype
  }
  console.log(uploadParams.Body)
  // like the data that is console logged her to get sent back in the end
  return s3.upload(uploadParams).promise()
}
// setting credentials in node.js, there are several ways to supply credentials to the sdk, can load from shared credentials file, environment variables, json file
// the example uses this with .env files from environment variables, The environment variable names
