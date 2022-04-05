import { v4 as uuidv4 } from "uuid";

class Todo {
    id?: string;
    title: string;
    done: boolean;
    deadline: Date;

    constructor() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }
}

export { Todo };
