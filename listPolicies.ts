
import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";
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
});