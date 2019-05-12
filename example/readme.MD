# Hellow-World
This project is a simple demo generated using Tantalum as an example serverless offline AWS NodeJS project using 

- S3
- Lamdba & API Gateway
- SNS


## Running Example

If the example generated correctly then just issue the command 

    serverless offline start

You should see something similar to 

```
starting handler
Serverless: Found S3 event listener for upload-bucket
warn: the bucket "upload-bucket" already exists
S3 local started ( port:8000 )
Serverless: creating bucket: upload-bucket
error: Error creating bucket. Bucket "upload-bucket" already exists
info: PUT /upload-bucket 409 6ms -
Dynamodb Local Started, Visit: http://localhost:8080/shell
Serverless: DynamoDB - created table upload-log
Serverless: INFO[serverless-offline-sns]: Creating topic: "upload-topic" for fn "queueprocess"
Serverless: Starting Offline: dev/us-east-1.

Serverless: Routes for list:
Serverless: GET /list

Serverless: Routes for queueprocess:
Serverless: (none)

Serverless: Routes for postprocess:
Serverless: (none)

Serverless: Offline listening on http://localhost:3000

```

If you open a browser and enter **http://localgost:3000/list** (which is the http function set up to list the content of the DynamoDB table) if should return an empty response.
The next step is to upload the example **hello_world.json** file to the S3 bucket using an AWS CLI command:

```
AWS_ACCESS_KEY_ID=S3RVER AWS_SECRET_ACCESS_KEY=S3RVER  aws --endpoint http://localhost:8000 s3api put-object --bucket upload-bucket --key upload/hello_world  --body hello_world.json
```

If you then try the list function again (**http://localgost:3000/list**) the browser response should show the data from the file that was uploaded.

