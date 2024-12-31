import { Elysia } from "elysia";
import { classDashboardQuality } from "../../controller/controllerQuality";
import { dataDashboard } from "../../DataType";
import { jwt } from '@elysiajs/jwt'

export const QualityRoutes_GET = (app: Elysia) => {
    app.use(jwt({
        name: 'myJWTNamespace',
        secret: Bun.env['TOKEN_SECRET'] || 'secret',
        exp: '2h'
    }))
        .get('/api/v1/GetStartUpCheck_Dashboard', async ({ controllerDashboardQuality }: { controllerDashboardQuality: classDashboardQuality }) => {
            const result = await controllerDashboardQuality.GetStartUpCheck_Dashboard();
            return result;
        }, {
            detail: {
                tags: ['Api_Get'],
            },
            type: 'json',
        })
        .get('/api/v1/GetModelChange_Dashboard', async ({ controllerDashboardQuality }: { controllerDashboardQuality: classDashboardQuality }) => {
            const result = await controllerDashboardQuality.GetMDC_Dashboard();
            return result;
        }, {
            detail: {
                tags: ['Api_Get'],
            },
            type: 'json',
        })
        .get('/api/v1/GetESD_Dashboard/:_Supporter_Flag', async ({ controllerDashboardQuality, params }: { controllerDashboardQuality: classDashboardQuality, params: { _Supporter_Flag: number } }) => {
            const result = await controllerDashboardQuality.GetESD_Dashboard(params._Supporter_Flag);
            return result;
        }, {
            detail: {
                tags: ['Api_Get'],
            },
            type: 'json',
        })

        .get('/api/v1/GetSMLD_Mastertarget/:Web_Type', async ({ controllerDashboardQuality, params }: { controllerDashboardQuality: classDashboardQuality, params: { Web_Type: string } }) => {
            const result = await controllerDashboardQuality.GetSMLD_Mastertarget(params.Web_Type);
            return result;
        },
            {
                detail: {
                    tags: ['Api_Get'],
                },
                type: 'json',
            }
        )
        .get('/api/v1/GetQASampling_Dashboard', async ({ controllerDashboardQuality }: { controllerDashboardQuality: classDashboardQuality }) => {
            const result = await controllerDashboardQuality.GetQASampling_Dashboard();
            return result;
        }, {
            detail: {
                tags: ['Api_Get'],
            },
            type: 'json',
        })
        .get('/api/v1/GetLAR_Dashboard', async ({ controllerDashboardQuality }: { controllerDashboardQuality: classDashboardQuality }) => {
            const result = await controllerDashboardQuality.GetLAR_Dashboard();
            return result;
        }, {
            detail: {
                tags: ['Api_Get'],
            },
            type: 'json',
        })
        .get('/api/v1/GetLAR_Target', async ({ controllerDashboardQuality }: { controllerDashboardQuality: classDashboardQuality }) => {
            const result = await controllerDashboardQuality.GetLAR_Target();
            return result;
        }, {
            detail: {
                tags: ['Api_Get'],
            },
            type: 'json',
        })
        .get('/api/v1/QA/GetQA_MST_BIZ', ({ controllerDashboardQuality }: {  controllerDashboardQuality: classDashboardQuality }) => 
            controllerDashboardQuality.MST_BIZ(), {
            detail: {
                tags: ['Api_Get']
            }
        })
        .get('/api/v1/QA/GetQA_EMPLOYEE', ({ controllerDashboardQuality }: {  controllerDashboardQuality: classDashboardQuality }) =>{
            const result = controllerDashboardQuality.GET_EMPLOYEE();
            return result;}, 
            {
            detail: {
                tags: ['Api_Get'],
            },
            type: 'json',
        })
        .get('/api/v1/GetSamplingTable', async ({ controllerDashboardQuality }: { controllerDashboardQuality: classDashboardQuality }) => {
            const result = await controllerDashboardQuality.GetSamplingTable();
            return result;
        }, {
            detail: {
                tags: ['Api_Get'],
            },
            type: 'json',
        })
        .get('/api/v1/GetAlert/:Function_Name', async ({ controllerDashboardQuality, params }: { controllerDashboardQuality: classDashboardQuality, params: { Function_Name: string } }) => {
            const result = await controllerDashboardQuality.GetAlert(params.Function_Name);
            return result;
        },
            {
                detail: {
                    tags: ['Api_Get'],
                },
                type: 'json',
            }
        )
        .get('/api/v1/GetAlertParameters', async ({ controllerDashboardQuality }: { controllerDashboardQuality: classDashboardQuality }) => {
            const result = await controllerDashboardQuality.GetAlertParameters();
            return result;
        },
            {
                detail: {
                    tags: ['Api_Get'],
                },
                type: 'json',
            }
        )
        .get('/api/v1/Get4MChange_Dashboard', async ({ controllerDashboardQuality }: { controllerDashboardQuality: classDashboardQuality }) => {
            const result = await controllerDashboardQuality.Dashboard_4MChange();
            return result;
        }, {
            detail: {
                tags: ['Api_Get'],
            },
            type: 'json',
        })
        .get('/api/v1/GetAllAlert', async ({ controllerDashboardQuality }: { controllerDashboardQuality: classDashboardQuality }) => {
            const result = await controllerDashboardQuality.GetAllAlert();
            return result;
        },
            {
                detail: {
                    tags: ['Api_Get'],
                },
                type: 'json',
            }
        )
        .get('/api/v1/GetNoStartUpCheck_Dashboard', async ({ controllerDashboardQuality }: { controllerDashboardQuality: classDashboardQuality }) => {
            const result = await controllerDashboardQuality.GetNoStartUpCheck_Dashboard();
            return result;
        },
            {
                detail: {
                    tags: ['Api_Get'],
                },
                type: 'json',
            }
        )
        .get('/api/v1/GetSMLD_Dashboard/:Mc_Type', async ({ controllerDashboardQuality ,params}: { controllerDashboardQuality: classDashboardQuality,params:{Mc_Type : string} }) => {
            const result = await controllerDashboardQuality.GetSMLD_Dashboard(params.Mc_Type);
            return result;
        },
            {
                detail: {
                    tags: ['Api_Get'],
                },
                type: 'json',
            }
        )
        
}