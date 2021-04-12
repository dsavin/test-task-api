import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";


export async function main(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  

  if (event.body) {
    const data = JSON.parse(event.body);
  }

  return {
    statusCode: 200,
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
}