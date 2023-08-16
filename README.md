# Serverless Fraud and Compliance at Scale

## Architecture

![architecture](images/serverless_fintech_stack.png)

## General Requirements
Basic knowledge of:
- Git
- Javascript
- Python
- AWS (Configured and set up AWS Account with Admin privileges)
- Docker(Configured and set up docker)


## Compliance Stack
- Install Serverless Framework:

```
cd backend && cd cs-service
```

#### Folder structure and contents:

```bash
├── resources                  <-- Directory that holds aws cloudformation resources definition
│   ├── data-lake.yml          <-- yaml template to provision s3 bucket to hold sensitve PII
└── Dockerfile                 <-- Dockerfile to provision LLM and application dependencies
└── handler.py                 <-- LLM inference lambda python code
├── requirements.txt           <-- pytorch, transfomers and pdf reader LLM dependencies 
├── serverless.yml             <-- yaml template to provision lambda and other required AWS resources 
```


```
npm install -g serverless

```


- On `serverless.yml` file, use the same service name - `cs-service` or create a new one
- Replace the `<AWS_S3_BUCKET_NAME>` variable with the name you plan to use
- Similarly, replace the `<AWS_S3_BUCKET_NAME>` on the `resources/data-lake.yml` file with a different name from the s3 bucket named on `serverless.yml`

- Firstly, run this aws command to retrieve `<AWS_ACCOUNT_ID>`:

  
```
aws sts get-caller-identity --query 'Account' --output text
```

- Build docker image for LLM and push to AWS ECR by running the following commands:

```
docker build -t llm-ftdc .
```

```
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
```

```
aws ecr create-repository --repository-name llm-ftdc --image-scanning-configuration scanOnPush=true --image-tag-mutability MUTABLE --region us-east-1
```

```
docker tag llm-ftdc <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/llm-ftdc:latest
```

```
docker push <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/llm-ftdc:latest
```

- Finally, deploy your infrastructure:
  
```
serverless deploy --verbose
```

- Clean up to remove your deployed AWS resources by using the following command:
  
```
serverless remove --verbose
```

## Transaction Processing Stack - If creating the Fraud Detector models

```
cd backend && cd txn-service
```

#### Folder structure and contents:

```bash
├──Artifacts                          <-- Directory that will hold solution Artifacts
├── lambda-functions                  <-- Directory contains Lambda functions code
│   ├── fdLambdaConsumer.py           <-- Consumer Lambda function code
│   ├── fdLambdaStreamProducer.py     <-- Producer Lambda function code
│   └── LambdaConfig.py               <-- Configuration Lambda function code
│   └── requirements.txt              <-- Dependencies file for Lambda functions
└── RealTimeFraudPrevention           <-- Directory contains Kinesis Data Analytics PyFlink application code 
│   ├── main.py                       <-- Kinesis Data Analytics PyFlink application code calling Amazon Fraud Detector Model
│   ├── bin
│   │   ├── requirements.txt          <-- Dependencies file for Kinesis Data Analytics PyFlink application code 
├── Realtime_Fraud_Prevention_CFN.yml <-- CloudFormation Template used to provision AWS Managed Kafka, Flink, S3, Lambda, Fraud Detector, SNS, Eventbridge and more 
```

#### Install Lambda functions dependencies and package code

```bash
pip3 install -r ./lambda-functions/requirements.txt -t ./lambda-functions

(cd lambda-functions; zip -r ../Artifacts/lambda-functions.zip .)
```

### Install Kinesis Data Analytics PyFlink application dependencies and package code

```bash
pip3 install -r ./RealTimeFraudPrevention/bin/requirements.txt -t ./RealTimeFraudPrevention/lib/packages

curl https://repo.maven.apache.org/maven2/org/apache/flink/flink-sql-connector-kafka_2.11/1.11.2/flink-sql-connector-kafka_2.11-1.11.2.jar --output ./RealTimeFraudPrevention/lib/flink-sql-connector-kafka_2.11-1.11.2.jar

zip -r ./Artifacts/RealTimeFraudPrevention.zip ./RealTimeFraudPrevention
```

#### Download Kafka-s3 connector

```bash

(cd Artifacts; curl -L -O https://d1i4a15mxbxib1.cloudfront.net/api/plugins/confluentinc/kafka-connect-s3/versions/10.0.3/confluentinc-kafka-connect-s3-10.0.3.zip)
```


#### Upload solution artifacts

Replace:
* **<S3_Bucket_name>** with your unique bucket name and 
* **<Amazon_Fraud_Detector_Region>** with the region used to deploy the Amazon Fraud Detector model. E.g. *us-east-1* 

```
aws s3 mb s3://<AWS_S3_BUCKET_NAME> --region <Amazon_Fraud_Detector_Region>
aws s3 sync ./Artifacts/ s3://<AWS_S3_BUCKET_NAME>
```

#### Deploy solution

Using AWS CLI
    * Run the following command to deploy the CloudFormation template

Replace:

* **<S3_Bucket_name>** --> The bucket you created in the upload solution artifacts step above.
* The Amazon Fraud Detector Model Output Parameters created:
    * **<Amazon_Fraud_Detector_Entity_Type>** --> Entity type name in Amazon Fraud Detector. E.g *customer*
    * **<Amazon_Fraud_Detector_Event_Name>** --> Event type name in Amazon Fraud Detector. E.g *transaction*
    * **<Amazon_Fraud_Detector_Name>** --> Entity type name in Amazon Fraud Detector. E.g *transaction_event*
* **<MSK_Input_Topic_Name>** --> Input Kafka topic name. E.g *transactions*
* **<MSK_Output_Topic_Name>** --> Output Kafka topic name. E.g *processed_transactions*.
* **<Email_Address_For_Notifications>** --> Email to receive email notifications
* **<Amazon_Fraud_Detector_Region>** -->the region used to deploy Amazon Fraud Detector. E.g. us-east-1
* **<Stack_name>** CloudFormation stack name. The stack name must satisfy the regular expression pattern: [a-z][a-z0-9\-]+ and must be less than 15 characters long. For example; *fraud-prevention*

```

aws cloudformation create-stack --template-body file://Realtime_Fraud_Prevention_CFN.yml --parameters \
ParameterKey=BucketName,ParameterValue=<S3_Bucket_name> \
ParameterKey=FraudDetectorEntityType,ParameterValue=<Amazon_Fraud_Detector_Entity_Type> \
ParameterKey=FraudDetectorEventName,ParameterValue=<Amazon_Fraud_Detector_Event_Name> \
ParameterKey=FraudDetectorName,ParameterValue=<Amazon_Fraud_Detector_Name> \
ParameterKey=KafkaInputTopic,ParameterValue=<MSK_Input_Topic_Name> \
ParameterKey=KafkaOutputTopic,ParameterValue=<MSK_Output_Topic_Name> \
ParameterKey=S3SourceCodePath,ParameterValue=lambda-functions.zip \
ParameterKey=S3connectorPath,ParameterValue=confluentinc-kafka-connect-s3-10.0.3.zip \
ParameterKey=YourEmail,ParameterValue=<Email_Address_For_Notifications> \
--capabilities CAPABILITY_NAMED_IAM \
--region <Amazon_Fraud_Detector_Region> \
--stack-name <Stack_name>
```

The stack will approximately take 30-45 minutes to deploy. Once completed, check email for sns email and confirm subscription


#### Enable solution

Using AWS CLI, make sure you are at the same region used while deployment.

1. To start generating synthetic transaction data:

    * Run the command that can be retrieved from the value of **EnableEventRule** Key in Ouptut tab in CloudFormation console, it looks like

```
aws events enable-rule --name <EventBridge_rule_name>
```

2. To start consuming the processed transactions and sending email notifications:

    * Run the command that can be retrieved from the value of **EnableEventSourceMapping** Key in Ouptut tab in CloudFormation console, it looks like

```
aws lambda update-event-source-mapping --uuid <Event_Source_mapping_UUID> --enabled
```

3. You would now receive email when a transaction is Fraudlent or Legitimate



#### Destroying infrastructure


## Reporting Stack

```
cd backend && cd rpt-service
```

#### Folder structure and contents:

```bash
├── superset                   <-- Directory that holds Apache Superset for monitoring and visualizing transaction data
├── resources                  <-- Directory that holds aws cloudformation resources definition
│   ├── batch-process.yml      <-- yaml template to provision Glue crawler for crawling transactions data written to s3, Glue DB Catalog and dynamoDB resources
├── functions                  <-- Directory that holding lambda function
│   ├── handler.py             <-- Lambda handler to kick-start glue crawler process and handle athena queries to create table
├── serverless.yml             <-- yaml template to provision lambda and other required AWS resources 
```


* Replace your <AWS_S3_BUCKET_NAME> on these files:
    * `serverless.yml`
    * `batch-process.yml`
    * `handler.py`
 
```
serverless deploy --verbose
```

#### Visualizing and monitoring transaction data:

- On the root folder:
```
cd superset 
```
- Run:
```
TAG="2.1.0-dev" docker-compose -f docker-compose-non-dev.yml $@ up
```
- Navigate to `http://localhost:8088`. Username and password: `admin`
- From the dropdown `Settings` menu on the right, select `Database connections`. Choose Amazon Athena Database and connect to it by adding a DB connection string like so:

```
awsathena+rest://{aws_access_key_id}:{aws_secret_access_key}@athena.{region_name}.amazonaws.com/{txn_database}?s3_staging_dir={s3://<AWS_S3_BUCKET>}
```

#### Destroying infrastructure

- At the root folder:
```
serverless remove --verbose
```
- Run:
```
TAG="2.1.0-dev" docker-compose -f docker-compose-non-dev.yml $@ down -v
```
