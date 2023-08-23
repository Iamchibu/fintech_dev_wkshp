import os
import time
import json
import boto3


# Initialize S3, Glue, and Athena clients
s3 = boto3.client('s3')
glue = boto3.client('glue')
athena = boto3.client('athena')
dynamodb = boto3.resource('dynamodb')
db_table = dynamodb.Table(os.environ['TABLE_NAME'])

# Environment variables
DB = os.environ['DB']
CATALOG = os.environ['CATALOG']
WORKGROUP = os.environ['WORKGROUP']
OUTPUT = os.environ['OUTPUT']
CRAWLER = os.environ['CRAWLER']
JOB_NAME = os.environ['JOB_NAME']

def slsEtl(event, context):
    print("event object:", event)

    # Check if the function has run before
    response = db_table.get_item(Key={'id': 'hasRun'})

    if 'Item' in response:
        print("Function has already run before. Exiting.")
        return {
            'statusCode': 200,
            'body': 'Function has already run before.'
        }

    # Start Glue Crawler and wait for it to complete
    glue.start_crawler(Name=CRAWLER)
    print("before crawler start")
    wait_for_crawler_to_complete(glue, CRAWLER)
    print("After crawler completed")

    # Get the tables in the Glue Database
    response = glue.get_tables(DatabaseName=DB)

    # Loop through the table list and create and execute a query for each table
    for table in response['TableList']:
        # Create Athena query
        query = create_query(table['Name'])

        print("query sent to athena:", query)
        # Start Athena query and wait for it to complete
        start_response = athena.start_query_execution(
            QueryString=query,
            QueryExecutionContext={'Database': DB, 'Catalog': CATALOG},
            ResultConfiguration={'OutputLocation': OUTPUT}
        )
        wait_for_query_to_complete(athena, start_response['QueryExecutionId'])

    # After the function logic, mark that the function has run
    table.put_item(Item={'id': 'hasRun', 'value': 'true'})

    print("Function executed and marked as run.")

    return {
        'statusCode': 200,
        'body': 'ETL process completed successfully and Function executed and marked as run.'
    }


def wait_for_job_to_complete(glue, job_name, job_run_id):
    ##Log this function to understand what's happening here

    while True:
        response = glue.get_job_run(JobName=job_name, RunId=job_run_id)
        status = response['JobRun']['JobRunState']
        if status in ('FAILED', 'STOPPED'):
            error_message = response['JobRun']['ErrorMessage']
            raise Exception(f'Job run failed with error: {error_message}')
        elif status == 'SUCCEEDED':
            break
        time.sleep(60)


def wait_for_crawler_to_complete(glue, crawler_name):
    while True:
        response = glue.get_crawler(Name=crawler_name)
        status = response['Crawler']['State']
        if status in ('FAILED', 'STOPPED'):
            raise Exception('Crawler run failed')
        elif status == 'READY':
            break
        time.sleep(60)

def wait_for_query_to_complete(athena, query_execution_id):
    while True:
        response = athena.get_query_execution(QueryExecutionId=query_execution_id)
        status = response['QueryExecution']['Status']['State']
        if status in ('FAILED', 'CANCELLED'):
            raise Exception('Query execution failed')
        elif status == 'SUCCEEDED':
            break
        time.sleep(5)



def create_query(tablename):
    try:
        print("TABLENAME:", tablename)
        print("DB:", DB)

        response = glue.get_table(DatabaseName=DB, Name=tablename)
        print("get table call response objects:", response)

        columns = response['Table']['StorageDescriptor']['Columns']
        column_string = ', '.join([f"`{col['Name']}` {col['Type']}" for col in columns])
    except Exception as e:
        print(f"An error occurred: {e}")
        raise e

    query = f"""
    CREATE EXTERNAL TABLE IF NOT EXISTS {DB}.{tablename} (
    {column_string}
    )
    ROW FORMAT SERDE 'org.openx.data.jsonserde.JsonSerDe'
    STORED AS INPUTFORMAT 'org.apache.hadoop.mapred.TextInputFormat'
    OUTPUTFORMAT 'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat'
    LOCATION 's3://n-ftdc-target-bucket/processedTxns/{tablename}/'
    TBLPROPERTIES ('classification'='json', 'serialization.format'='1');
    """
    return query
