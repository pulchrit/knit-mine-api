// Attribution: https://medium.com/@blackwright/browser-file-uploads-to-s3-using-fetch-46a53d106e11
// and: https://devcenter.heroku.com/articles/s3-upload-node

const express = require('express')
const AWS = require('aws-sdk')
const uuidv4 = require('uuid/v4')
const config = require('../config')
 
const signS3Router = express.Router()

const s3 = new AWS.S3()

signS3Router
    .route('/sign-s3')
    .get((req, res, next) => {
        // Get the file type from the query string sent by the client.
        const {fileType} = req.query
        // Get the extension from the fileType.
        const extension = fileType.split('/')[1]
        // Rename the file with a uuid for uniqueness when stored in S3 bucket, 
        // and add extension back on.
        const fileName = `${uuidv4()}.${extension}`

        // Create S3 params for getting the signed URL from and uploading to S3
        const s3Params = {
            Bucket: config.S3_BUCKET_NAME,
            Key: fileName, 
            ContentType: fileType,
            ACL: 'public-read'
        }

        // Submit the file name and type and get the signed URL from S3 to use on the client side
        // when uploading the file. Return signedRequest and image url as json object in response.
        s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if (err) {
              next(err)
            } else {
              res.json({
                signedRequest: data,
                url: `https://${config.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`
              })
            }
        })
    })

module.exports = signS3Router