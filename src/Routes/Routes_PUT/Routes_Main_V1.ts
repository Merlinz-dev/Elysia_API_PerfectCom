import { Elysia } from "elysia";
import { jwt } from '@elysiajs/jwt'
import { classMST, classEMS, classAuth } from "../../controller/controllerMain";
import { data, dataAuth } from "../../DataType";

export const MainRoutes_PUT = (app: Elysia) => {
    app.use(jwt({
        name: 'myJWTNamespace',
        secret: Bun.env['TOKEN_SECRET'] || 'secret',
        exp: '2h'
    }))
        .get('/profile', async ({ controllerMain_EMS, myJWTNamespace, set, cookie: { auth } }: { controllerMain_EMS: classEMS, body: dataAuth, myJWTNamespace: any, set: any, cookie: { auth: { value: string } } }) => {
            const checkAuth = await myJWTNamespace.verify(auth.value)
            if (!checkAuth) {
                set.status = 401
                return 'Unauthorized'
            }
            if(checkAuth.Center === 'AM-System'){
                const Authdata: dataAuth = {
                    UserID: checkAuth.Employee_ID,
                    Password: '',
                };
                const profile = await controllerMain_EMS.GetEmployee(Authdata);
                return `Hello ${profile[0].Employee_NameEN}`
            }else {
                set.status = 401
                return 'No Permission'
            }
        }, {
            detail: {
                tags: ['Auth'],
            },
            type: 'json',
        })
        // .get('/Test_AMD_Oracle', async ({ controllerMain_AMD_ORACLE }: { controllerMain_AMD_ORACLE: classAMD_ORACLE}) => {
        //     const result = await controllerMain_AMD_ORACLE.GetTest_AMD();
        //     return result;
        // })
}