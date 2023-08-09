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
│   ├── main.py                       <-- Kinesis Data Analytics PyFlink application code calling Amazon Fraud Detector Model
│   ├── bin
│   │   ├── requirements.txt          <-- Dependencies file for Kinesis Data Analytics PyFlink application code 
├── Realtime_Fraud_Prevention_CFN.yml <-- CloudFormation Template used to provision AWS Managed Kafka, Flink, S3, Lambda, Fraud Detector, SNS, Eventbridge and more 
```


```
npm install -g serverless

```


- On `serverless.yml` file, use the same service name - `cs-service` or create a new one
- Replace the `AWS_S3_BUCKET_NAME` variable with the name you plan to use
- Similarly, replace the `AWS_S3_BUCKET_NAME` on the `resources/data-lake.yml` file with a different name from the s3 bucket named on `serverless.yml`

- Firstly, run this aws command to retrieve `AWS_ACCOUNT_ID`:

  
```
aws sts get-caller-identity --query 'Account' --output text
```

- Build docker image for LLM and push to AWS ECR by running the following commands:

```
docker build -t llm-ftdc .
```

```
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
```

```
aws ecr create-repository --repository-name llm-ftdc --image-scanning-configuration scanOnPush=true --image-tag-mutability MUTABLE --region us-east-1
```

```
docker tag llm-ftdc AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/llm-ftdc:latest
```

```
docker push AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/llm-ftdc:latest
```

- Finally, deploy your infrastructure:
  
```
serverless deploy --verbose
```

- Clean up to remove your deployed AWS resources by using the following command:
  
```
serverless remove --verbose
```

## Transaction Processing Stack

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


`coming soon…`


## Reporting Stack

```
cd backend && cd rpt-service
```
`coming soon…`




**More updates coming soon…**
