import boto3
import os
from PyPDF2 import PdfFileReader
from transformers import pipeline

s3 = boto3.client('s3')

def process_pdf(event, context):
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key'] 
        download_path = '/tmp/{}'.format(key)
        s3.download_file(bucket, key, download_path)

        with open(download_path, "rb") as file:
            pdf = PdfFileReader(file)
            text = ""
            for page in range(pdf.getNumPages()):
                text += pdf.getPage(page).extractText()

        nlp = pipeline("ner", device=-1) # to utilize CPU
        ner_results = nlp(text)
        pii_data = [result for result in ner_results if result['entity_group'] in ['I-PER', 'I-ORG', 'I-LOC', 'I-MISC']]

        if pii_data:
            print('PII found in {}'.format(key))
