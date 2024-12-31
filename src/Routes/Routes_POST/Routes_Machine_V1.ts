import { Elysia } from "elysia";
import { classMachine } from "../../controller/controllerMachine";
import { dataMachine } from "../../DataType";
import { jwt } from '@elysiajs/jwt'

export const MachineRoutes_POST = (app: Elysia) => {
    app.use(jwt({
            name: 'myJWTNamespace',
            secret: Bun.env['TOKEN_SECRET'] || 'secret',
            exp: '2h'
        }))
        .post('/api/v1/PickUpRate', async ({ controllerMachine, body }: { controllerMachine: classMachine, body: dataMachine }) => {
            const result = await controllerMachine.GetPickUpRate(body);
            return result;
        }, {
            detail: {
                tags: ['Api_Post'],
                requestBody: {
                    description: "Example body for PickUpRate",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    StartDate : { type: "number" },
                                    EndDate : { type: "number" },
                                    Line_Name : { type: "string" },
                                },
                                required: ["StartDate","EndDate","Line_Name"],
                                example: {
                                    StartDate: 20240620,
                                    EndDate: 20240621,
                                    Line_Name: "A01",
                                }
                            },
                           
                        },
                    },
                }
            },
            type: 'json',
        })
        .post('/api/v1/EHUMbyLINE', async ({ controllerMachine, body }: { controllerMachine: classMachine, body: dataMachine }) => {
            const result = await controllerMachine.GetEHUMbyLINE(body);
            return result;
        }, {
            detail: {
                tags: ['Api_Post'],
                requestBody: {
                    description: "Example body for EHUMbyLine",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    Line_Name : { type: "string" },
                                },
                                required: ["Line_Name"],
                                example: {
                                    Line_Name: "A01",
                                }
                            },
                           
                        },
                    },
                }
            },
            type: 'json',
        })
        .post('/api/v1/LineStopTimeByLine', async ({ controllerMachine, body }: { controllerMachine: classMachine, body: dataMachine }) => {
            const result = await controllerMachine.GetLineStopTimeByLine(body);
            return result;
        }, {
            detail: {
                tags: ['Api_Post'],
                requestBody: {
                    description: "Example body for LineStopTimeByLine",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    Line_Name : { type: "string" },
                                    StartDate : { type: "number" },
                                    EndDate : { type: "number" },
                                    ChartType : { type: "string" },
                                    WebName : { type: "string" },
                                },
                                required: ["Line_Name","StartDate","EndDate","ChartType","WebName"],
                                example: {
                                    Line_Name: "A01",
                                    StartDate: 20240620,
                                    EndDate: 20240621,
                                    ChartType : "Ratio",
                                    WebName : "Machine"
                                }
                            },
                           
                        },
                    },
                }
            },
            type: 'json',
        })
        .post('/api/v1/EHUMbyLineAndTroubleName', async ({ controllerMachine, body }: { controllerMachine: classMachine, body: dataMachine }) => {
            const result = await controllerMachine.GetEHUMbyLineAndTroubleName(body);
            return result;
        }, {
            detail: {
                tags: ['Api_Post'],
            },
            type: 'json',
        })
        .post('/api/v1/GetLineStopTime_Pareto_Week', async ({ controllerMachine, body }: { controllerMachine: classMachine, body: dataMachine }) => {
            const result = await controllerMachine.GetLineStopTime_Pareto_Week(body);
            return result;
        }, {
            detail: {
                tags: ['Api_Post'],
                requestBody: {
                    description: "Example body for GetLineStopTime Pareto Week",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    Week : { type: "string" },
                                    Year : { type: "number" },
                                    Line_Name : { type: "string" },
                                    WebName : { type: "string" },
                                },
                                required: ["Week","Year","Line_Name","WebName"],
                                example: {
                                    Week: "WK21",
                                    Year: 2024,
                                    Line_Name : "A01",
                                    WebName : "Machine"
                                }
                            },
                           
                        },
                    },
                }
            },
            type: 'json',
        })
        .post('/api/v1/GetLineStopTime_Pareto_Month', async ({ controllerMachine, body }: { controllerMachine: classMachine, body: dataMachine }) => {
            const result = await controllerMachine.GetLineStopTime_Pareto_Month(body);
            return result;
        }, {
            detail: {
                tags: ['Api_Post'],
                requestBody: {
                    description: "Example body for GetLineStopTime Pareto Month",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    Month : { type: "number" },
                                    Year : { type: "number" },
                                    Line_Name : { type: "string" },
                                    WebName : { type: "string" },
                                },
                                required: ["Week","Year","Line_Name","WebName"],
                                example: {
                                    Month: "1",
                                    Year: 2024,
                                    Line_Name : "A01",
                                    WebName : "Machine"
                                }
                            },
                           
                        },
                    },
                }
            },
            type: 'json',
        })
        .post('/api/v1/GetLineStopTime_Pareto_Day', async ({ controllerMachine, body }: { controllerMachine: classMachine, body: dataMachine }) => {
            const result = await controllerMachine.GetLineStopTime_Pareto_Day(body);
            return result;
        }, {
            detail: {
                tags: ['Api_Post'],
                requestBody: {
                    description: "Example body for GetLineStopTime Pareto Day",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    Line_Name : { type: "string" },
                                    StartDate : { type: "number" },
                                    WebName : { type: "string" },
                                },
                                required: ["StartDate","Line_Name","WebName"],
                                example: {
                                    StartDate: "20240620",
                                    Line_Name : "A01",
                                    WebName : "Machine"
                                }
                            },
                           
                        },
                    },
                }
            },
            type: 'json',
        })
}