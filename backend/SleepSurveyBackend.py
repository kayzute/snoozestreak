import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const dynamoDb = DynamoDBDocument.from(new DynamoDB());
const TABLE_NAME = process.env.TABLE_NAME || 'SleepSurveyUsers';

// Primary Roles (Red - Main issues)
const PRIMARY_ROLES = [
  {
    name: 'Fragmented Sleeper',
    condition: (answers) => answers.nightWakeups === 'Yes'
  },
  {
    name: 'Sleep-Deprived Dreamer',
    condition: (answers) => answers.hoursOfSleep === 'Less than 7'
  },
  {
    name: 'Restless Relaxer',
    condition: (answers) => answers.sleepDuration === 'More than 30 min'
  },
  {
    name: 'Oversleeping Owl',
    condition: (answers) => answers.hoursOfSleep === 'More than 9' && answers.lateExercise === 'Yes'
  },
  {
    name: 'Overcaffeinator',
    condition: (answers) => answers.lateCaffeine === 'Yes'
  },
  {
    name: 'Workaholic Wanderer',
    condition: (answers) => answers.lateExercise === 'Yes'
  },
  {
    name: 'Screen Zombie',
    condition: (answers) => 
      answers.screenTimeBeforeBed === 'Yes' || 
      answers.screenTime === 'Until I sleep'
  }
];

// Secondary Roles (Yellow - Areas for improvement)
const SECONDARY_ROLES = [
  {
    name: 'Digestive Disruptor',
    condition: (answers) => 
      answers.largeMealsBeforeBed === 'Yes' || 
      answers.alcoholBeforeBed === 'Yes'
  },
  {
    name: 'Workaholic Wanderer',
    condition: (answers) => answers.consistentBedtime === 'No'
  }
];

const HEALTHY_SLEEPER = 'Healthy Sleeper';

function assignSleepRole(answers) {
  // 1. Check primary roles first
  for (const role of PRIMARY_ROLES) {
    if (role.condition(answers)) {
      return role.name;
    }
  }

  // 2. Check secondary roles if no primary found
  for (const role of SECONDARY_ROLES) {
    if (role.condition(answers)) {
      return role.name;
    }
  }

  // 3. Default to healthy sleeper
  return HEALTHY_SLEEPER;
}

function getRoleDescription(role) {
  const descriptions = {
    'Restless Relaxer': 'Takes more than 30 minutes to fall asleep (Primary sleep issue)',
    'Fragmented Sleeper': 'Wakes during night with trouble falling back asleep (Primary sleep issue)',
    'Sleep-Deprived Dreamer': 'Gets less than 7 hours of sleep (Primary sleep issue)',
    'Oversleeping Owl': 'Sleeps more than 9 hours due to fatigue (Primary sleep issue)',
    'Overcaffeinator': 'Consumes caffeine within 10 hours of sleep (Primary sleep issue)',
    'Workaholic Wanderer': 'Exercises or works within 2 hours of bedtime (Primary/Secondary issue)',
    'Screen Zombie': 'Uses screens within 1 hour of bedtime (Primary sleep issue)',
    'Digestive Disruptor': 'Consumes large meals or alcohol before bed (Secondary issue)',
    'Healthy Sleeper': 'Maintains generally healthy sleep habits'
  };
  return descriptions[role] || 'No specific sleep issues identified';
}

async function processSurvey(surveyData) {
  // Validate required fields
  if (!surveyData.userId || !surveyData.responses) {
    throw new Error('Missing required fields: userId and responses');
  }

  // Assign role using the same logic as frontend
  const assignedRole = assignSleepRole(surveyData.responses);
  const roleDescription = getRoleDescription(assignedRole);

  const params = {
    TableName: TABLE_NAME,
    Item: {
      userId: surveyData.userId,
      surveyResponses: surveyData.responses,
      assignedRole,
      roleDescription,
      timestamp: new Date().toISOString()
    }
  };

  await dynamoDb.put(params);

  return {
    statusCode: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' 
    },
    body: JSON.stringify({ 
      success: true,
      role: assignedRole,
      description: roleDescription,
      userId: surveyData.userId
    })
  };
}

async function getUserData(userId) {
  const params = {
    TableName: TABLE_NAME,
    Key: { userId }
  };

  const result = await dynamoDb.get(params);

  if (!result.Item) {
    return {
      statusCode: 404,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify({ message: 'User not found' })
    };
  }

  return {
    statusCode: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' 
    },
    body: JSON.stringify(result.Item)
  };
}

export const handler = async (event) => {
  try {
    const httpMethod = event.httpMethod;
    const path = event.path;

    // Handle survey submission
    if (path === '/api/survey' && httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      return await processSurvey(body);
    }

    // Handle user data retrieval
    if (path.startsWith('/api/user/') && httpMethod === 'GET') {
      const userId = event.pathParameters.userId;
      return await getUserData(userId);
    }

    return {
      statusCode: 404,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify({ message: 'Route not found' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify({ 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};