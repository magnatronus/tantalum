'use strict';

const path = require('path');
const AWS = require('./helpers/awsHelper');


/**
 * Lambda listing DynamoDB content
 */
module.exports.list = async (event) => {

    console.log("Generating list of DynamoDB items");
    try{
        const result = await AWS.DYNAMODB.scan({TableName:'upload-log'}).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(result.Items)
        };
    }
    catch(err){
        return {
            status: 500,
            body:JSON.stringify(err)
        };
    }
};

/**
 * Lambda triggered on SNS queue item
 */
module.exports.queueprocess = async (event) => {

    console.log("SNS queue process triggered");

    // generate the object to store
    const payload = event.Records[0].Sns.Message;
    const id = event.Records[0].Sns.MessageId

    // Generate the params
    var params = {
        TableName:'upload-log',
        Item: {
            "id": id,
            "message": JSON.parse(payload)
        }
    };

    // Store item
    try{
        const result = await AWS.DYNAMODB.put(params).promise();
        console.log('Item added to DynamoDB');
    }catch(err){
        console.log(err);
    }
    return null;

};



/**
 * Lambda triggered on S3 bucket upload
 */
module.exports.postprocess = async (event) => {

    console.log("S3 post process triggered");

    // Generate info so we can get the object from the specified bucket
    const received_key = event.Records[0].s3.object.key;
    var get_param = {
        Bucket: 'upload-bucket',
        Key: received_key,
    };

    // Get the uploaded file
    console.log("Getting payload from bucket");
    let json;
    try{
        const payload = await AWS.S3.getObject(get_param).promise();
        json = payload.Body.toString('utf-8');
    }catch(err){
        console.log(err);
    }

    // Put data onto the SNS queue - if we have some content
    if(json){
        console.log('Publishing to the SNS queue');
        const result = await AWS.SNS.publish({
            Message: json,
            MessageStructure: "json",
            TopicArn: "arn:aws:sns:us-east-1:123456789012:upload-topic",
        }).promise();
    }
    return null;
};