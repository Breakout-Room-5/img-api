require('dotenv').config()
const AWS = require('aws-sdk')
const s3 = new AWS.S3()

module.export = function (file) {
  const uploadParams = {
    Bucket: 'image-bucket-big-yoshi',
    Key: new Date().getTime + '_' + file.fieldname,
    Body: file.buffer,
    ACL: 'public-read',
    ContentType: file.mime
  }

  return s3.upload(uploadParams).promise()
}
