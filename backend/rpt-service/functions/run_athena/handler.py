import boto3
import os

athena_client = boto3.client('athena')
QUERY = os.environ['QUERY']
DB = os.environ['DB']
CATALOG = os.environ['CATALOG']
WORKGROUP = os.environ['WORKGROUP']
OUTPUT = os.environ['OUTPUT']


# class QueryRange:
#     def __init__(self, year, month, start_day, end_day):
#         self.year = year
#         self.month = month
#         self.start_day = start_day
#         self.end_day = end_day

#     def convert_to_query(self):
#         return QUERY.format(year=self.year,
#                             month=self.month,
#                             start_day=self.start_day,
#                             end_day=self.end_day)


# def create_queries(year, month, day):
#     # create list of dates between start date and current date
#     start = datetime.date(year=year, month=month, day=day)
#     timezone = pytz.timezone('Europe/Brussels')
#     now = datetime.datetime.now(timezone).date()
#     if now <= start:
#         raise Exception("Input date should be smaller than the current date")

#     numdays = (now-start).days
#     date_list = [start+datetime.timedelta(days=x) for x in range(numdays)]

#     # create query ranges
#     query_ranges = []
#     start_date = date_list[0]
#     for date in date_list:
#         if date.month > start_date.month:
#             # append query range when month ends up until last day of month
#             query_ranges.append(QueryRange(start_date.year, start_date.month, start_date.day, date.day - 1))
#             start_date = date
#         if date.day > start_date.day+3:
#             # append 4 day query range
#             query_ranges.append(QueryRange(start_date.year, start_date.month, start_date.day, start_date.day+3))
#             start_date = date
#         if date == now-datetime.timedelta(days=1):
#             # append query range until current date
#             query_ranges.append(QueryRange(start_date.year, start_date.month, start_date.day, date.day))

#     # convert each query range to a query, return queries
#     return [query_range.convert_to_query() for query_range in query_ranges]


def execute_query(query):
    response = athena_client.start_query_execution(
        QueryString=query,
        QueryExecutionContext={'Database': DB, 'Catalog': CATALOG},
        ResultConfiguration={'OutputLocation': OUTPUT}
    )
    return response['QueryExecutionId']


def runEtl(event, context):
    # try:
    #     queries = create_queries(event['year'], event['month'], event['day'])
    # except Exception as e:
    #     return {'Response': 'FAILED', 'Error': str(e)}
    # execution_ids = []
    # for query in queries:
    try:
        execution_id = execute_query(QUERY)
    except Exception as e:
        return {'Response': 'FAILED', 'Error': str(e)}
    return {'Response': 'SUCCEEDED', 'QueryExecutionId': execution_id}