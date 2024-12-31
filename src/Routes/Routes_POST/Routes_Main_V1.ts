import { Elysia } from "elysia";
import { jwt } from '@elysiajs/jwt'
import { classTest1, classTest2 } from "../../controller/controllerMain";
import { data , dataUser} from "../../DataType";

export const MainRoutes_POST = (app: Elysia) => {
    app.use(jwt({
        name: 'myJWTNamespace',
        secret: Bun.env['TOKEN_SECRET'] || 'secret',
        exp: '2h'
    }))
        .post('/api/v1/FindMean', async ({ controllerMain_Test1, body }: { controllerMain_Test1: classTest1, body: data }) => {
            const result = await controllerMain_Test1.FindMean(body);
            return result;
        }, {
            detail: {
                tags: ['Api_Post'],
                requestBody: {
                    description: "Example body for FindMean",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    x: {
                                        type: "array",
                                        items: { type: "number" }
                                    },
                                    w: {
                                        type: "array",
                                        items: { type: "number" }
                                    },
                                },
                                required: ["x"],
                                example: {
                                    x: [10, 20, 30],
                                    w: [1, 2, 3]
                                }
                            },
                        }
                    }
                }
            },
            type: 'json',
        })
        .post('/api/v1/CreateUser', async ({ controllerMain_Test2, body }: { controllerMain_Test2: classTest2, body: dataUser }) => {
            const result = await controllerMain_Test2.CreateUser(body);
            return result;
        }, {
            detail: {
                tags: ['Api_Post'],
                requestBody: {
                    description: "Example body for CreateUser",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    UserName : {type: "string"},
                                    UserID : {type: "string"},
                                    Password : {type: "string"},
                                    Mail : {type: "string"},
                                    Role : {type: "string"},
                                    FirstName : {type: "string"},
                                    LastName : {type: "string"},
                                    PhoneNumber : {type: "string"},
                                    BirthDate : {type: "string"},
                                },
                                required: ["UserName","UserID","Password","Mail","Role","FirstName","LastName","PhoneNumber","BirthDate"],
                                example: {
                                    UserName: "TestName",
                                    UserID: "Test",
                                    Password: "1234",
                                    Mail: "test@gmail.com",
                                    Role: "User",
                                    FirstName: "Test",
                                    LastName: "Test",
                                    PhoneNumber: "123456789",
                                    BirthDate: "2000-01-01"
                                }
                            },
                        }
                    }
                }
            },
            type: 'json',
        })
        //  *************** No DB ***************
        .post('/api/v1/CreateUser_NoDB', async ({ controllerMain_Test2, body }: { controllerMain_Test2: classTest2, body: dataUser }) => {
            const result = await controllerMain_Test2.CreateUser_NoDB(body);
            return result;
        }, {
            detail: {
                tags: ['Api_Post'],
                requestBody: {
                    description: "Example body for CreateUser_NoDB",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    UserName : {type: "string"},
                                    UserID : {type: "string"},
                                    Password : {type: "string"},
                                    Mail : {type: "string"},
                                    Role : {type: "string"},
                                    FirstName : {type: "string"},
                                    LastName : {type: "string"},
                                    PhoneNumber : {type: "string"},
                                    BirthDate : {type: "string"},
                                },
                                required: ["UserName","UserID","Password","Mail","Role","FirstName","LastName","PhoneNumber","BirthDate"],
                                example: {
                                    UserName: "TestName",
                                    UserID: "Test",
                                    Password: "1234",
                                    Mail: "test@gmail.com",
                                    Role: "User",
                                    FirstName: "Test",
                                    LastName: "Test",
                                    PhoneNumber: "123456789",
                                    BirthDate: "2000-01-01"
                                }
                            },
                        }
                    }
                }
            },
            type: 'json',
        })

}
