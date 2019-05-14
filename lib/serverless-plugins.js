/**
 * serverless-plugins.js
 * This module defines the currently supported serverless plugins that will be included as part of the .tantalum.yml definition file
 * The serverless-offline plugin is ALWAYS included as this provides the lambda & API Gateway functionality
 */
module.exports.plugins = [
    {"aws": "s3", "plugin": "serverless-s3-local" },
    {"aws": "dynamodb", "plugin": "serverless-dynamodb-local" },
    {"aws": "sns", "plugin": "serverless-offline-sns" },
    {"aws": "ssm", "plugin": "serverless-offline-ssm" }
];