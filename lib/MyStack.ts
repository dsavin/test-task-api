import * as cdk from "@aws-cdk/core";
import * as sst from "@serverless-stack/resources";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    const policiesTable = new sst.Table(this, "Policies", {
      fields: {
        policyId: sst.TableFieldType.STRING,
        name: sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: "policyId" },
    });

    const breedsTable = new sst.Table(this, "Breeds", {
      fields: {
        breedId: sst.TableFieldType.STRING,
        name: sst.TableFieldType.STRING,
        priceModifier: sst.TableFieldType.NUMBER,
        pet:  sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: "breedId" },
    });

    // Create the HTTP API
    const api = new sst.Api(this, "Api", {
      defaultFunctionProps: {
        environment: {
          policiesTableName: policiesTable.dynamodbTable.tableName,
          breedsTableName: breedsTable.dynamodbTable.tableName
        },
      },
      routes: {
        "GET /policies": "src/list-policies.main",
        "POST /": "src/search.main",
        //"GET    /notes": "src/list.main",
        //"POST   /notes": "src/create.main",
        "GET    /breeds/{pet}": "src/list-breeds.main",
        //"PUT    /notes/{id}": "src/update.main",
        //"DELETE /notes/{id}": "src/delete.main",
      },
    });

    // Allow the API to access the table
    api.attachPermissions([policiesTable, breedsTable]);

    // Show API endpoint in output
    new cdk.CfnOutput(this, "ApiEndpoint", {
      value: api.httpApi.apiEndpoint,
    });
  }
}
