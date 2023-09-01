![ftdc_logo](images/ftdc_logo.png)

**Serverless Fraud and Compliance with ML** workshop at [fintech_devcon](https://fintechdevcon.io/) presented by [moov](https://moov.io) on `08/24/2023` in `ATX`

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
└── Dockerfile                 <-- Dockerfile to provision LLM and application dependencies
└── handler.py                 <-- LLM inference lambda python code
├── requirements.txt           <-- pytorch, transfomers and pdf reader LLM dependencies 
├── serverless.yml             <-- yaml template to provision lambda and other required AWS resources 
```


```
npm install -g serverless

```


- On `serverless.yml` file, use the same service name - `cs-service` or create a new one
- Replace the `<AWS_S3_BUCKET_NAME>` on the `serverless.yml` file with the s3 bucket name you would be uploading your loan documents to`

- Next, run this aws command to retrieve `<AWS_ACCOUNT_ID>`:

  
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

## Transaction Processing Stack - TPS

**NOTE:**
`TPS` is tightly coupled with the `Reporting Stack` and `TPS` isn't cheap to deploy on AWS :(. Also, before provisioning the `TPS` you would have to train and productionize a `Fraud Detector Model`. For those running their AWS account on a budget or are not able to quickly deploy their Fraud Detector model, we included a sample dataset on the `test_data` folder of what a typical output from the `TPS` would look like for you to use on the `Reporting Stack` section. Otherwise, you can proceed with `Creating Fraud Detector model` section.


### Creating Fraud Detector model

- Follow the step by step directions on this [blog](https://aws.amazon.com/blogs/machine-learning/detect-online-transaction-fraud-with-new-amazon-fraud-detector-features/) to recreate and productionize the fraud model being used

- Next:
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

#### Install Kinesis Data Analytics PyFlink application dependencies and package code

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

Using AWS CLI, run the following command to deploy the CloudFormation template

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

- Head over to the AWS CloudFormation console and delete the created resources. Ensure that your MSK cluster and KDA application were all successfully deleted. If not go back and delete them. Do the same for the Fraud Detector deployment.


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
chmod +x deploy.sh
./deploy.sh
```
- Navigate to `http://localhost:8088`. Username and password: `admin`
 
- From the dropdown `Settings` menu on the right, select `Database connections`. Choose `Amazon Athena` Database and connect to it by adding a DB connection string like so:

```
awsathena+rest://{aws_access_key_id}:{aws_secret_access_key}@athena.{region_name}.amazonaws.com/{txn_database}?s3_staging_dir={s3://<AWS_S3_BUCKET>}
```
![db_cxn](images/db_cxn.png)

- Navigate to `SQL` dropdown down menu and select `SQL Lab`.
![sql_lab](images/sql_lab.png)

- Choose the name given to your Athena DB above. In our case, `ftdc_demo`, SCHEMA - `txn_database`, TABLE SCHEMA - `txn_processedtxns`
- Run the query below  
```
SELECT transaction_amt, email_address, event_id, CAST("from_iso8601_timestamp"(event_time) AS timestamp) event_ts, fd.outcome FROM txn_processedtxns;
```
![sql_query](images/sql_query.png)

- Use the data from the query above to create a chart that shows the amount of approved / fraudulent transactions over time.
![txn_monitor](images/txn_monitor_chart.png)

#### Destroying infrastructure

- At the root folder:
```
serverless remove --verbose
```
- Navigate to the `superset` folder:
```
cd superset
chmod +x stop.sh
./stop.sh
```



## Frontend Mobile Deployment

#### Applications to be installed first:

•	Android Studio or XCode for Android Emulator and iOS Simulator respectively

#### Expo Go App installation:

_Steps:_

•	Go to Play store or Appstore to search for Expo Go, then install on your Android device and iPhone device.

#### React Native Expo Setup: 

_Steps:_

•	If you don’t have Node(npm) install Node with this [link](https://nodejs.org/en/download), if you have Node(npm) installed you can skip this step.

•	Navigate to the SecureBank folder

```
cd frontend && cd SecureBank
```
•	Install all the apps libraries

```
npm install
```

```
npm install -g expo-cli
```

```
npm install expo
```

#### AWS:

_Steps:_

•	Install Amplify CLI 

```
npm install -g @aws-amplify/cli
```

•	If you don’t have AWS Account click this [link](https://aws.amazon.com) to create one 

•	Sign in on AWS, and search for Amplify, 
- Click on New app
- Select Build an app, use “Any name” Bank, then click Confirm Deployment
- Once deployment is done, Launch Studio to manage the data and Backend
- Go to the side Menu, scroll down to Set up, then Authentication, Then Scroll to the Deploy bottom
- Once deployment is done. Go to the right top corner
- Click on Deployment successful – click for the next steps
- Copy the amplify pull … code in the terminal of the project. To pull the changes to the local
- CLick Yes when Amplify asks for permission to Login
- Choose the default editor, JavaScript, React Native, select enter for the next 3 questions, then “y” for the last question



#### Amplify configuration

```
amplify configure
```

•	To initialize a new Amplify project, run

```
amplify init
```

•	Select the same <AWS_S3_BUCKET> created when you deployed your Compliance Stack above, 

```
amplify import storage
```

•	To deploy Storage and Auth to AWS, run

```
amplify push
```

•	Go to the App and then Profile at the bottom tab, click on upload a Document, and upload a pdf.


#### Running the App:
_Steps:_

•	Start app

```
npx expo start
```
Upon running successfully, tap **i** for iOS simulator or iPhone, and **a** for Android emulator and Android Device or Scan QR code with Expo Go app.

•	Signup with your email and go through the authentication flow to gain acccess to the app.


<img src='images/welcome.jpeg' width='220'> <img src='images/Signup.jpeg' width='220'>
<img src='images/Signin.jpeg' width='220'> <img src='images/Dashboard.jpeg' width='220'>


### Compliance workflow:

•	Go to the `Profile` bottom tab. Tap the `Upload Document` button to upload a loan underwriting document. Head to the `PII` and `Non-PII` <AWS_S3_Bucket> created while working through the compliance stack deployment to verify the classification of your uploaded document.

<img src='images/Profile.jpeg' width='220'> <img src='images/UploadDoc.jpeg' width='220'>
