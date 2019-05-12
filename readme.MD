# Tantalum
**Tantalum** is a CLI that can be used to generate a development environment for off-line serverless AWS nodejs projects. It does this be creating a [serverless](https://serverless.com/) project using various available plug-ins.

**NB: This is currently very much WIP** and under active development.

## Functionality
**Tantalum** can be used to generate a serverless project , enabling local development for the parts of AWS listed below.

- **Lambda**
- **API Gateway**
- S3
- DynamoDB
- SNS

The first 2 are always included as Tantalum relies on the **serverless-offline** plug-in which provides this functionality.

## Configuration
**Tantalum** will create a project using the generated **.tantalum.yml** file that is created, which will include all the supported **serverless** plug-ins. If you want to customise the generated project just edit the **.tantalum.yml** file **BEFORE** running the generate command.

## Installation
The module should be installed globally using the following command:
    npm i -g tantalum


## Commands
**Tantalum** can be invoked via the *tantalum* command or the alias *tlm* and should be run in the directory of the project you wish to add it to, or a new clean directory.

there are 3 available commands:

- **create**
- **generate**
- *helloworld*

### create
This will create the **.tantalum.yml** file that defines the *serverless*  plug-ins and set up.

### generate
This will create a **serverless.yml** file (or **serverless-tlm.yml** if serverless.yml exists) that defines the off-line serverless setup. It will also attempt to install the selected serverless plugins as dev dependencies in the package.json file, if it exists.

### helloworld
This command will generate a complete example serverless offline project that uses the following offline services. 

- API Gateway 
- Lambda
- S3
- DynamoDb 

This should be run in a new, blank directory after the *create* and *generate* commands to create the example.. 

The **helloworld** project that will be created has a simple spec:

- I want to upload a JSON document to an S3 bucket (called upload-bucket)
- When the document is uploaded a lambda is triggered that reads the document and puts a message on an SNS queue (upload-topic)
- When the message is received another lambda will create a DynamoDB entry
- Then using the API gateway the dynamoDb entries can be listed via a lambda function (http://localhost/list function)



## History


## Acknowledgements
- [serverless](https://serverless.com/)
- [serverless-offline](https://github.com/dherault/serverless-offline)
- [serverless-s3-local](https://github.com/ar90n/serverless-s3-local)
- [serverless-offline-sns](https://github.com/mj1618/serverless-offline-sns)
- [serverless-dynamodb-local](https://github.com/99xt/serverless-dynamodb-local)

