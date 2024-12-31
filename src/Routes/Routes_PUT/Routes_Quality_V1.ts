import { Elysia } from "elysia";
import { classDashboardQuality } from "../../controller/controllerQuality";
import { dataDashboard } from "../../DataType";
import { jwt } from '@elysiajs/jwt'

export const QualityRoutes_PUT = (app: Elysia) => {
    app.use(jwt({
        name: 'myJWTNamespace',
        secret: Bun.env['TOKEN_SECRET'] || 'secret',
        exp: '2h'
    }))
    .put('/api/v1/UpdateSMLD_Mastertarget', async ({ controllerDashboardQuality, body }: { controllerDashboardQuality: classDashboardQuality, body: dataDashboard }) => {
        const result = await controllerDashboardQuality.UpdateSMLD_Mastertarget(body);
        return result;
    }, {
        detail: {
            tags: ['Api_Put'],
            requestBody: {
                description: "Example body for Update SMLD Master Target",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                Business : { type : "string"},
                                SPI_KPI : { type: "number" },
                                SPI_FPYL : { type: "number"},
                                SPI_RFYL : { type: "number" },
                                SPI_RYL : { type: "number" },
                                BRI_KPI : { type: "number" },
                                BRI_FPYL : { type : "number"},
                                BRI_RFYL : { type : "number"},
                                BRI_RYL : { type : "number"},
                                ARI_KPI : { type : "number"},
                                ARI_FPYL : { type : "number"},
                                ARI_RFYL : { type : "number"},
                                ARI_RYL : { type : "number"},
                                VI_KPI : { type : "number"},
                            },
                            required: ["SPI_KPI","SPI_FPYL","SPI_RFYL","SPI_RYL","BRI_KPI","BRI_FPYL",
                                "BRI_RFYL","BRI_RYL","ARI_KPI","ARI_FPYL","ARI_RFYL","ARI_RYL","VI_KPI"
                            ],
                            example: {
                                Business : "IM (Rigid)",
                                SPI_KPI : 10,
                                SPI_FPYL : 10,
                                SPI_RFYL : 10,
                                SPI_RYL : 10,
                                BRI_KPI : 10,
                                BRI_FPYL : 10,
                                BRI_RFYL : 10,
                                BRI_RYL : 10,
                                ARI_KPI : 10,
                                ARI_FPYL : 10,
                                ARI_RFYL : 10,
                                ARI_RYL : 10,
                                VI_KPI : 10,
                            }
                        },
                        
                    },
                },
            }
        },
        type: 'json',
    })

}