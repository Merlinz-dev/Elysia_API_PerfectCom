import { Elysia } from "elysia";
import { jwt } from '@elysiajs/jwt'
import { classTest2 } from "../../controller/controllerMain";
import { data, dataUser  } from "../../DataType";

export const MainRoutes_PUT = (app: Elysia) => {
    app.use(jwt({
        name: 'myJWTNamespace',
        secret: Bun.env['TOKEN_SECRET'] || 'secret',
        exp: '2h'
    }))
    .put('/api/v1/Update_UserDetails', async ({ controllerMain_Test2, body }: { controllerMain_Test2: classTest2, body: dataUser }) => {
        const result = await controllerMain_Test2.Update_UserDetails(body);
        return result;
    }, {
        detail: {
            tags: ['Api_Post'],
            requestBody: {
                description: "Example body for Update_UserDetails",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                UserID: {type: "string"},
                                FirstName : {type: "string"},
                                LastName : {type: "string"},
                                PhoneNumber : {type: "string"},
                                BirthDate : {type: "string"},
                            },
                            required: ["UserID","FirstName","LastName","PhoneNumber","BirthDate"],
                            example: {
                                UserID: "Test",
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
    .put('/api/v1/Update_UserDetails_NoDB', async ({ controllerMain_Test2, body }: { controllerMain_Test2: classTest2, body: dataUser }) => {
        const result = await controllerMain_Test2.Update_UserDetails_NoDB(body);
        return result;
    }, {
        detail: {
            tags: ['Api_Post'],
            requestBody: {
                description: "Example body for Update_UserDetails_NoDB",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                UserID: {type: "string"},
                                FirstName : {type: "string"},
                                LastName : {type: "string"},
                                PhoneNumber : {type: "string"},
                                BirthDate : {type: "string"},
                            },
                            required: ["UserID","FirstName","LastName","PhoneNumber","BirthDate"],
                            example: {
                                UserID: "Test",
                                FirstName: "Test2",
                                LastName: "Test2",
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