export type TTodo = {
    id: number
    todo: string
    completed: boolean
    userId: number | string
}

export type TTodoResponseGet = {
    todos: TTodo[]
    total: number,
    skip: number,
    limit: number
}

export type TTodoGetParams = {
    userId?: number,limit?: number, skip?: number
}

export type TTodoPostPayload = {
    todo: string
    completed: boolean
    userId: number
}

export type TTodoPatchPayload = {
    todo?: string,
    completed?: boolean,
}
// {
//     "todos": [
//       {
//         "id": 1,
//         "todo": "Do something nice for someone I care about",
//         "completed": true,
//         "userId": 26
//       },
//       {...},
//       {...}
//       // 30 items
//     ],
//     "total": 150,
//     "skip": 0,
//     "limit": 30
//   }