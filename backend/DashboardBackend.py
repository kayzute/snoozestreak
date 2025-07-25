import os
import json
import boto3
from decimal import Decimal
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")
TABLE_NAME = os.environ["DashboardBackend"]
table = dynamodb.Table(TABLE_NAME)


def determine_role_from_survey(survey):
    a = survey.get("answers", {})

    # primary roles
    if a.get("timeToFallAsleep", 0) > 30:
        return "Restless Relaxer"
    if a.get("wakeUpTrouble") is True:
        return "Fragmented Sleeper"
    if a.get("sleepDuration", 0) < 7:
        return "Sleep‑Deprived Dreamer"
    if a.get("sleepDuration", 0) > 9 and a.get("sleepByFatigue") is True:
        return "Oversleeping Owl"

    # secondary roles
    if a.get("coffeeBeforeSleep") is True and a.get("coffeeHoursBefore", 0) <= 10:
        return "Overcaffeinator"
    if a.get("largeMealOrAlcoholBeforeSleep") is True:
        return "Digestive Disruptor"
    if a.get("workOrExerciseBeforeSleep") is True:
        return "Workaholic Wanderer"
    if a.get("screenTimeBeforeSleep") is True:
        return "Screen Zombie"

    return "Healthy Sleeper"


def determine_goals_from_role(role):
    return {
        "Restless Relaxer": [
            "Practice a 5‑minute relaxation or breathing exercise",
            "Go to bed at predetermined bedtime"
        ],
        "Fragmented Sleeper": [
            "Keep bedroom dark and quiet",
            "Establish a sleep ritual (ex: counting)"
        ],
        "Sleep‑Deprived Dreamer": [
            "Set a regular sleep‑wake schedule (one alarm only!)",
            "Review sleep patterns in health app"
        ],
        "Oversleeping Owl": [
            "Set a consistent wake‑up time",
            "Limit total time in bed to 9 hrs",
            "Avoid long naps (no more than 30 minutes!)"
        ],
        "Overcaffeinator": [
            "Switch to decaf after morning coffee",
            "Hydrate with water in the evening"
        ],
        "Digestive Disruptor": [
            "Choose lighter evening snacks",
            "Go for a light stroll after dinner"
        ],
        "Workaholic Wanderer": [
            "Turn off work device a few hours before bed",
            "Establish a 30‑minute wind‑down routine",
            "Journal or meditate to clear your mind"
        ],
        "Screen Zombie": [
            "Remove screens from bedroom (or limit accessibility)",
            "Read a book",
            "Use blue‑light filters on devices"
        ],
    }.get(role, [
        "Review your sleep log weekly",
        "Explore new relaxation techniques"
    ])


def lambda_handler(event, context):
    print(event)  # for CloudWatch debugging
    route = event.get("routeKey")
    params = event.get("pathParameters") or {}
    user_id = params.get("userId")
    status_code = 200
    headers = {"Content-Type": "application/json"}
    body = {}

    try:

        # GET/items
        if route == "GET /items":
            resp = table.scan()
            body = {"items": resp.get("Items", [])}

        # fetch user record through  GET/items/{userId}
        elif route == "GET /items/{userId}":
            if not user_id:
                raise KeyError("Missing path parameter userId")
            resp = table.get_item(Key={"userId": user_id})
            item = resp.get("Item")
            if not item:
                raise KeyError(f"No data for userId {user_id}")
            body = {
                "userId":     user_id,
                "surveyRole": item.get("surveyRole"),
                "goals":      item.get("goals"),
                "streakCount": (
                    int(item["streakCount"])
                    if isinstance(item.get("streakCount"), Decimal)
                    else item.get("streakCount")
                )
            }

        # submit survey with roles and goals:   PUT/items/{userId}/survey
        elif route == "PUT /items/{userId}/survey":
            if not user_id:
                raise KeyError("Missing path parameter userId")
            payload = json.loads(event.get("body") or "{}")
            survey  = payload.get("survey")
            if not survey:
                raise KeyError("Request body must include 'survey'")
            role  = determine_role_from_survey(survey)
            goals = determine_goals_from_role(role)

            upd = table.update_item(
                Key={"userId": user_id},
                UpdateExpression="SET surveyRole = :r, goals = :g",
                ExpressionAttributeValues={":r": role, ":g": goals},
                ReturnValues="UPDATED_NEW"
            )

            body = {
                "message":    f"Survey processed for {user_id}",
                "surveyRole": role,
                "goals":      goals,
                # streakCount may or may not exist yet
                "streakCount": upd["Attributes"].get("streakCount")
            }

        # increment streak:  PUT/items/{userId}/streak
        elif route == "PUT /items/{userId}/streak":
            if not user_id:
                raise KeyError("Missing path parameter userId")
            upd = table.update_item(
                Key={"userId": user_id},
                UpdateExpression="SET streakCount = if_not_exists(streakCount, :z) + :i",
                ExpressionAttributeValues={":z": 0, ":i": 1},
                ReturnValues="UPDATED_NEW"
            )
            body = {
                "message":    f"Streak updated for {user_id}",
                "streakCount": upd["Attributes"].get("streakCount")
            }

        # fetch survey role:  GET/items/{userId}/survey-role
        elif route == "GET /items/{userId}/survey-role":
            if not user_id:
                raise KeyError("Missing path parameter userId")
            resp = table.get_item(Key={"userId": user_id})
            item = resp.get("Item")
            if not item:
                raise KeyError(f"No data for userId {user_id}")
            body = {"userId": user_id, "surveyRole": item.get("surveyRole")}

        # delete user entry:  DELETE/items/{userId}
        elif route == "DELETE /items/{userId}":
            if not user_id:
                raise KeyError("Missing path parameter userId")
            table.delete_item(Key={"userId": user_id})
            body = {"message": f"Deleted entry for userId {user_id}"}

        else:
            raise KeyError(f"Unsupported route: {route}")

    except KeyError as e:
        status_code = 400
        body = {"error": str(e)}
    except Exception as e:
        status_code = 500
        body = {"error": str(e)}

    return {
        "statusCode": status_code,
        "headers": headers,
        "body": json.dumps(body)
    }