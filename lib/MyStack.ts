import * as cdk from "@aws-cdk/core";
import * as sst from "@serverless-stack/resources";

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    const policiesTable = new sst.Table(this, "Policies", {
      fields: {
        policyId: sst.TableFieldType.STRING,
        name: sst.TableFieldType.STRING,
        basePrice: sst.TableFieldType.NUMBER
      },
      primaryIndex: { partitionKey: "policyId" },
    });

    const configTable = new sst.Table(this, "Configs", {
      fields: {
        configId: sst.TableFieldType.STRING,
        value: sst.TableFieldType.STRING,

      },
      primaryIndex: { partitionKey: "configId" },
    });

    const breedsTable = new sst.Table(this, "Breeds", {
      fields: {
        breedId: sst.TableFieldType.STRING,
        name: sst.TableFieldType.STRING,
        priceModifier: sst.TableFieldType.NUMBER,
        pet:  sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: "breedId" },
      secondaryIndexes: {
        breedPetIndex: { partitionKey: "breedId", sortKey: "pet" },
      },
    });

    const api = new sst.Api(this, "Api", {
      defaultFunctionProps: {
        environment: {
          policiesTableName: policiesTable.dynamodbTable.tableName,
          breedsTableName: breedsTable.dynamodbTable.tableName,
          configTableName: configTable.dynamodbTable.tableName

        },
      },
      routes: {
        "GET /policies": "src/list-policies.main",
        "POST /": "src/search.main",
        "GET    /breeds/{pet}": "src/list-breeds.main",
      },
    });


    api.attachPermissions([policiesTable, breedsTable]);

    new cdk.CfnOutput(this, "ApiEndpoint", {
      value: api.httpApi.apiEndpoint,
    });
  }
}
