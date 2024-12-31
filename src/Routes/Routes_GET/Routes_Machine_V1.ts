import { Elysia } from "elysia";
import { classMachine } from "../../controller/controllerMachine";
import { jwt } from '@elysiajs/jwt'
import { dataMachine ,dataAuth} from "../../DataType";
import { classMST, classEMS, classAuth } from "../../controller/controllerMain";

export const MachineRoutes_GET = (app: Elysia) => {
    app.use(jwt({
            name: 'myJWTNamespace',
            secret: Bun.env['TOKEN_SECRET'] || 'secret',
            exp: '2h'
        }))
        .get('/api/v1/EHUM/LayoutPosition', ({ controllerMachine }: { controllerMachine: classMachine }) => controllerMachine.GetLayoutPosition_EHUM(), {
            detail: {
                tags: ['Api_Get']
            }
        })
        .get('/api/v1/EHUM/LineStop/:WebName', ({ controllerMachine,params }: { controllerMachine: classMachine,params : {WebName : string} }) => controllerMachine.GetLineStop_EHUM(params.WebName), {
            detail: {
                tags: ['Api_Get']
            }
        })
        .get('/api/v1/EHUM/LineStopArgent/:WebName', ({ controllerMachine,params }: { controllerMachine: classMachine ,params : {WebName : string}}) => controllerMachine.GetLineStop_Argent_EHUM(params.WebName), {
            detail: {
                tags: ['Api_Get']
            }
        })
        .get('/api/v1/EHUM/NoPlan', ({ controllerMachine }: { controllerMachine: classMachine }) => controllerMachine.GetNoPlan_EHUM(), {
            detail: {
                tags: ['Api_Get']
            }
        })
        .get('/api/v1/EHUM/TopArgent/:WebName', ({ controllerMachine,params }: { controllerMachine: classMachine,params : {WebName : string} }) => controllerMachine.GetTopArgent_EHUM(params.WebName), {
            detail: {
                tags: ['Api_Get']
            }
        })
        .get('/profile', async ({ controllerMain_EMS, myJWTNamespace, set, cookie: { auth } }: { controllerMain_EMS: classEMS, body: dataAuth, myJWTNamespace: any, set: any, cookie: { auth: { value: string } } }) => {
            const checkAuth = await myJWTNamespace.verify(auth.value)
            if (!checkAuth) {
                set.status = 401
                return 'Unauthorized'
            }
            const Authdata: dataAuth = {
                UserID: checkAuth.Employee_ID,
                Password: '',
            };
            const profile = await controllerMain_EMS.GetEmployee(Authdata);
            return `Hello ${profile[0].Employee_NameEN}`
        }, {
            detail: {
                tags: ['Auth'],
            },
            type: 'json',
        })
}