'use strict'

const AWS = require('aws-sdk');

// S3
const s3 = new AWS.S3({
    s3ForcePathStyle: true,
    endpoint: new AWS.Endpoint('http://localhost:8000'),
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
  });
  
// SNS
const sns = new AWS.SNS({
endpoint: "http://127.0.0.1:4002",
region: "us-east-1",
})

// DynamoDB
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8080'
});


// Exported methods
module.exports.S3       = s3;
module.exports.SNS      = sns;
module.exports.DYNAMODB = dynamoDb;
