
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import dynamoDb from "../libs/dynamodb-lib";
//import notes from "./notes";

export async function main(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const params = {
    TableName: process.env.breedsTableName,
    IndexName: "pet-index",
    KeyConditionExpression: "#pet = :petType",
    ExpressionAttributeNames:{
        "#pet": "pet"
    },
    ExpressionAttributeValues: {
        ":petType": event.pathParameters?.pet,
    },

  };


  const result = await dynamoDb.query(params);

  return {
    statusCode: 200,
    body: JSON.stringify(result, null, "  "),
  };
}



/*
import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";
import { APIGatewayEventRequestContext, APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";

export const main = handler(async (event: APIGatewayProxyEventV2, context: APIGatewayEventRequestContext) => {
  console.log('test policies')
  
  const params = {
    TableName: process.env.tableName,    
  };

  console.log('test policies')

  const result = await dynamoDb.query(params);

  console.log(result)

  return result.Items;
});*/