import { UserInputError } from 'apollo-server-express';

interface Todo {
    completed: boolean;
    id: string;
    title: string;
}

interface TodosResult {
    totalCount: number;
    todos: Todo[];
}

interface Edge {
    cursor: string;
    node: Todo;
}
interface PageInfo {
    endCursor?: string;
    hasNextPage: boolean;
}
interface TodosResultCursor {
    edges: Edge[];
    pageInfo: PageInfo;
    totalCount: number;
}

const data = [
    {
        completed: false,
        id: '1',
        title: 'index overriding Games',
    },
    {
        completed: false,
        id: '2',
        title: 'target enhance asymmetric',
    },
    {
        completed: false,
        id: '3',
        title: 'target enhance asymmetric',
    },
    {
        completed: false,
        id: '4',
        title: 'target enhance asymmetric',
    },
    {
        completed: false,
        id: '5',
        title: 'target enhance asymmetric',
    },
    {
        completed: false,
        id: '6',
        title: 'target enhance asymmetric',
    },
    {
        completed: false,
        id: '7',
        title: 'target enhance asymmetric',
    },
    {
        completed: false,
        id: '8',
        title: 'target enhance asymmetric',
    },
];
export const allTodos = (_: any, { first, offset = 0 }: { first: number, offset: number}): TodosResult => {
    const totalCount = data.length;
    const todos = first === undefined ?
        data.slice(offset) :
        data.slice(offset, offset + first);
    const result = {
        todos,
        totalCount,
    };
    return result;
};
export const allTodosCursor = (_: any, { after, first }: {after: string, first: number }): TodosResultCursor => {
    if (first < 0) {
        throw new UserInputError('First must be positive');
    }
    const totalCount = data.length;
    let todos = [] as Todo[];
    let start = 0;
    if (after !== undefined) {
        const buff = new Buffer(after, 'base64');
        const id = buff.toString('ascii');
        const index = data.findIndex((todo) => todo.id === id);
        if (index === -1) {
            throw new UserInputError('After does not exist');
        }
        start = index + 1;
    }
    todos = first === undefined ?
        data :
        data.slice(start, start + first);
    let endCursor: string;
    const edges = todos.map((todo) => {
        const buffer = new Buffer(todo.id);
        endCursor = buffer.toString('base64');
        return ({
            cursor: endCursor,
            node: todo,
        });
    });
    const hasNextPage = start + first < totalCount;
    const pageInfo = endCursor !== undefined ?
        {
            endCursor,
            hasNextPage,
        } :
        {
            hasNextPage,
        };
    const result = {
        edges,
        pageInfo,
        totalCount,
    };
    return result;
};
