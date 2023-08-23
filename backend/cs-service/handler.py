import boto3
import uuid
import os
import io
import json
import urllib
from urllib.parse import unquote_plus
from PyPDF2 import PdfReader
from transformers import pipeline, AutoTokenizer, AutoModelForTokenClassification
import logging

# Load the tokenizer and the NER model globally
tokenizer = AutoTokenizer.from_pretrained("dslim/bert-base-NER")
ner_model = AutoModelForTokenClassification.from_pretrained("dslim/bert-base-NER")

# Define the NER pipeline globally
model = pipeline("ner", model=ner_model, tokenizer=tokenizer)

# PII entities that we want to check for
pii_entities = ['I-PER', 'I-ORG', 'I-LOC', 'I-MISC']

s3 = boto3.client('s3')
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def process_pdf(event, context):

    print("event object:",event)

    try:
        for record in event['Records']:
            bucket = record['s3']['bucket']['name']
            key = unquote_plus(record['s3']['object']['key'])
            tmpkey = key.replace('/', '')
            download_path = '/tmp/{}{}'.format(uuid.uuid4(), tmpkey)
            s3.download_file(bucket, key, download_path)
            output_text = extract_text_from_pdf(download_path)
            entities = model(output_text)

            print("print_statemnt_pred:",entities)
            # Log the prediction result
            logger.info(f"Prediction entities: {entities}")

            contains_pii = any(entity['entity'] in pii_entities for entity in entities)
            # contains_pii = len(entities) > 0

            for entity in entities:
                print("entity in entities:", entity)

                if entity['score'] >= 0.7 and entity['entity'] == 'I-ORG':

            # if contains_pii:
                # Upload to another S3 bucket
                    pii_bucket = 'ftdc-pii-bucket'
                    s3.upload_file(download_path, pii_bucket, key)
                    # Delete from original bucket
                    s3.delete_object(Bucket=bucket, Key=key)
                else:
                    # No action necessary if no PII is found
                    pass
    except Exception as e:
        logger.error("Error processing PDF: %s", e)
        raise e



def extract_text_from_pdf(file_path):
    with open(file_path, "rb") as file:
        pdf = PdfReader(file)
        text = ' '.join(page.extract_text() for page in pdf.pages)
    return text
