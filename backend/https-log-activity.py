import json
import boto3
from decimal import Decimal
from boto3.dynamodb.conditions import Key

client = boto3.client('dynamodb')
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table('http-activity-log-table')
tableName = 'http-activity-log-table'


def lambda_handler(event, context):
    # Debug via Cloudwatch
    # 200 statusCode --> OK!
    print(event)
    body = {}
    statusCode = 200
    headers = {
        "Content-Type": "application/json"
    }

    try:
        route = event.get('routeKey')
    
        # *** PUT OPERATION ***
        # Users update their log via submission
        if event['routeKey'] == "PUT /log":
            requestJSON = json.loads(event['body'])

            # Validation that required fields are filled out
            required_fields = ['userid', 'event', 'timestamp', 'hours']
            for field in required_fields:
                if field not in requestJSON or requestJSON[field] in [None, ""]:
                    raise KeyError(f"Missing or empty field: {field}")

            table.put_item(
                Item={
                    'userid': requestJSON['userid'],
                    'event': requestJSON['event'],
                    'timestamp': requestJSON['timestamp'],
                    'hours': Decimal(str(requestJSON['hours']))
                })
            
            body = 'Put item for userid:' + ' ' + requestJSON['userid']

        # *** GET OPERATION ***
        # Users want to access their log via log history
        elif event['routeKey'] == "GET /log":
            params = event.get('queryStringParameters') or {}
            userid = params.get('userid')
            start_key_timestamp = params.get('startKeyTimestamp')

            # Validate UserID is requesting log
            if not userid:
                raise KeyError("Missing 'userid' parameter")

            # Opens up the 'filing cabinet' labeled by userid, retrieves most recent 5 items
            query_args = {
                'KeyConditionExpression': Key('userid').eq(userid),
                'Limit': 5,
                'ScanIndexForward': False
            }

            if start_key_timestamp:
                query_args['ExclusiveStartKey'] = {
                    'userid': userid,
                    'timestamp': start_key_timestamp
                }

            response = table.query(**query_args)

            body = {
                'items': response.get('Items', []),
                'lastKey': response.get('LastEvaluatedKey')  # --> None if no more results
            }

        elif route == "DELETE /log":
            requestJSON = json.loads(event['body'])
            userid = requestJSON.get('userid')
            timestamp = requestJSON.get('timestamp')

            # Validation that required fields are filled out
            if not userid or not timestamp:
                raise KeyError("Missing 'userid' or 'timestamp' for deletion")

            # Deletes item from log
            table.delete_item(
                Key={
                    'userid': requestJSON['userid'],
                    'timestamp': requestJSON['timestamp']
                })

            body = {'message': f"Deleted item for userid {userid} at {timestamp}"}
    
        else:
            raise KeyError(f"Unsupported route: {route}")

    except KeyError as e:
        statusCode = 400
        body = {'error': str(e)}
    except Exception as e:
        statusCode = 500
        body = {'error': str(e)}

    return {
        "statusCode": statusCode,
        "headers": headers,
        "body": json.dumps(body)
    }