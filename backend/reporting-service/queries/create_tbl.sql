-- CREATE EXTERNAL TABLE txns_table_pq (
--     transaction_amt DOUBLE,
--     email_address STRING,
--     ip_address STRING,
--     transaction_currency STRING,
--     event_id STRING,
--     entity_id STRING,
--     event_time STRING,
--     billing_longitude STRING,
--     billing_state STRING,
--     user_agent STRING,
--     billing_street STRING,
--     billing_city STRING,
--     card_bin STRING,
--     customer_name STRING,
--     product_category STRING,
--     customer_job STRING,
--     phone STRING,
--     billing_latitude STRING,
--     billing_zip STRING,
-- )
-- PARTITIONED BY (event_time STRING)
-- STORED AS PARQUET
-- LOCATION 's3://ftdc-2023-txnbucket/batch-transformed/parquet/'
-- tblproperties ("parquet.compression"="SNAPPY");