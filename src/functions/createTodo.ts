import { APIGatewayProxyHandler } from "aws-lambda";
import dayjs from "dayjs";
import { Todo } from "src/model/Todo";
import { todoClient } from "src/utils/dynamodbClient";

interface ICreateTodo {
    user_id: string,
    todos: Todo[];
}

export const handler: APIGatewayProxyHandler = async (event) => {
    const { user_id } = event.pathParameters;

    const { title, done, deadline } = JSON.parse(event.body);

    const todo = new Todo();

    Object.assign(todo, {
        title,
        done,
        deadline: dayjs(deadline).toDate().toISOString()
    });

    const response = await todoClient.query({
        TableName: "todos",
        KeyConditionExpression: "user_id = :user_id",
        ExpressionAttributeValues: {
            ":user_id": user_id
        }
    }).promise();

    const collectionAlreadyExists = response.Items[0] as ICreateTodo;

    let todos: Todo[] = [];

    if(collectionAlreadyExists) {
        todos = collectionAlreadyExists.todos;
    }

    todos.push(todo);

    await todoClient.put({
        TableName: "todos",
        Item: {
            user_id,
            todos,
        }
    }).promise();

    const responseConfirm = await todoClient.query({
        TableName: "todos",
        KeyConditionExpression: "user_id = :user_id",
        ExpressionAttributeValues: {
            ":user_id": user_id
        }
    }).promise();

    return {
        statusCode: 201,
        body: JSON.stringify(responseConfirm.Items[0])
    }
}