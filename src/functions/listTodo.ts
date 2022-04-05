import { APIGatewayProxyHandler } from "aws-lambda";
import { todoClient } from "src/utils/dynamodbClient";

export const handler: APIGatewayProxyHandler = async (event) => {
    const { user_id } = event.pathParameters;

    const response = await todoClient.query({
        TableName: "todos",
        KeyConditionExpression: "user_id = :user_id",
        ExpressionAttributeValues: {
            ":user_id": user_id
        }
    }).promise();

    const todoAlreadyExists = response.Items[0];

    if(!todoAlreadyExists) {
        return {
            statusCode: 402,
            body: JSON.stringify({
                message: "Nenhum todo existente",
            })
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify(response.Items)
    }
}