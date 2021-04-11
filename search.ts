import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";

export const main: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  console.log(event)


  return {
    statusCode: 200,
    "headers": {
      "content-type": "application/json"
    },
    body: JSON.stringify([
      {
        "policyName": 'annual',
        "breed": 'breedA',
        "basePrice": 100,
        "finalPrice": 120.87,
      },
      {
        "policyName": 'annual',
        "breed": 'daily',
        "basePrice": 15,
        "finalPrice": 15.6,
      }
    ]),
  };
};
