import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AttributeMap } from "aws-sdk/clients/dynamodb";
import dynamoDb from "../libs/dynamodb-lib";
import Policy from "../types/policies"

export async function main(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  let policy = { basePrice: 0, name: ''} as any;
  let breed = { pet: '', priceModifier: 0, name: ''} as any;
  const petModifier = { cat: 1, dog: 1.034 };
  let finalPrice = 0
  let data = {age:0,excess:0, breedId: 0, policyId: 0}

  if (event.body) {
    data = JSON.parse(event.body);

    
    // Getting data for price modification
    const paramsBreed = {
      TableName: process.env.breedsTableName,
      KeyConditionExpression: "breedId = :breedId",

      ExpressionAttributeValues: {
          ":breedId": data.breedId.toString(),
      },
  
    };


    breed = (await dynamoDb.query(paramsBreed)).Items?.[0];
    
    const paramsPolicy = {
      TableName: process.env.policiesTableName,
      KeyConditionExpression: "policyId = :policyId",

      ExpressionAttributeValues: {
          ":policyId": data.policyId.toString(),
      },
  
    };




    policy = (await dynamoDb.query(paramsPolicy)).Items?.[0];

    console.log(policy, breed)

    finalPrice = parseFloat(policy?.basePrice.toString()) * parseFloat(petModifier[breed?.pet]) * parseFloat(breed?.priceModifier.toString()) * (data.age/1000 + 1) * (data.excess ? 1.044 : 1)
    console.log(policy?.basePrice, petModifier[breed?.pet], breed?.priceModifier, (data.age/1000+1), finalPrice, (data.excess ? 1.044 : 1))

    console.log('final', finalPrice)


  }

  if(finalPrice === 0){
    return {
      statusCode: 404,
      body: 'Cannot find quote'
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify([
      {
        "policyName": policy?.name,
        "breed": breed?.name,
        "breedModifier": breed?.priceModifier,
        "petModifier": petModifier[breed?.pet],
        "ageCorrection": data.age/1000 +1,
        "excessCorrection": data.excess ? 1.044 : 1,
        "basePrice": policy?.basePrice,
        "finalPrice": finalPrice.toFixed(2)
      }
    ]),
  };
}