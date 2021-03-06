import { APIGatewayEventRequestContext, APIGatewayProxyEventV2 } from "aws-lambda";

export default function handler(lambda) {
  return async function (event: APIGatewayProxyEventV2, context: APIGatewayEventRequestContext) {
    let body, statusCode;

    console.log('inside handler')

    try {
      // Run the Lambda
      body = await lambda(event, context);

      statusCode = 200;
    } catch (e) {
      body = { error: e.message };
      statusCode = 500;
    }

    // Return HTTP response
    return {
      statusCode,
      body: JSON.stringify(body),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  };
}