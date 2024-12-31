import { Elysia } from "elysia";
import { jwt } from '@elysiajs/jwt'
import { classSmart } from "../../controller/controllerSmart";
import { dataManagement } from "../../DataType";

export const SmartRoutes_DELETE = (app: Elysia) => {
    app.use(jwt({
        name: 'myJWTNamespace',
        secret: Bun.env['TOKEN_SECRET'] || 'secret',
        exp: '2h'
    }))
        .delete('/api/v1/DeleteSmartPlanManageTeam/:ID', async ({ controllerSmart, params }: { controllerSmart: classSmart, params: { ID: number } }) => {
            const result = await controllerSmart.DeleteSmartPlanManageTeam(params.ID);
            return result;
        }, {
            detail: {
                tags: ['Api_Delete'],
            },
            type: 'json',
        })
}