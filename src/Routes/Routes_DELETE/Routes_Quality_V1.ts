import { Elysia } from "elysia";
import { classDashboardQuality } from "../../controller/controllerQuality";
import { dataDashboard } from "../../DataType";
import { jwt } from "@elysiajs/jwt";

export const QualityRoutes_DELETE = (app: Elysia) => {
  app
    .use(
      jwt({
        name: "myJWTNamespace",
        secret: Bun.env["TOKEN_SECRET"] || "secret",
        exp: "2h",
      })
    )
    .delete(
      "/api/v1/DeleteAlert",
      async ({
        controllerDashboardQuality,
        body,
      }: {
        controllerDashboardQuality: classDashboardQuality;
        body: dataDashboard;
      }) => {
        const result = await controllerDashboardQuality.DeleteAlert(body);
        return result;
      },
      {
        detail: {
          tags: ["Api_Delete"],
          requestBody: {
            description: "Example body for DeleteAlert",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    Function_Name: { type: "string" },
                    Parameter_Name: { type: "string" },
                  },
                  required: ["Function_Name", "Parameter_Name"],
                  example: {
                    Function_Name: "Alert",
                    Parameter_Name: "Alert_1",
                  },
                },
              },
            },
          },
        },
        type: "json",
      }
    )
    .delete(
      "/api/v1/DeleteSelectAlert",
      async ({
        controllerDashboardQuality,
        body,
        myJWTNamespace,
        set,
        cookie: { auth },
      }: {
        controllerDashboardQuality: classDashboardQuality;
        body: dataDashboard;
        myJWTNamespace: any;
        set: any;
        cookie: { auth: { value: string } };
      }) => {
        const checkAuth = await myJWTNamespace.verify(auth.value);
        if (!checkAuth) {
          set.status = 401;
          return "Unauthorized";
        }
        const result = await controllerDashboardQuality.DeleteSelectAlert(body);
        return result;
      },
      {
        detail: {
          tags: ["Api_Delete"],
          requestBody: {
            description: "Example body for DeleteSelectAlert",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ID: { type: "number" },
                  },
                  required: ["ID"],
                  example: {
                    ID: 1,
                  },
                },
              },
            },
          },
        },
        type: "json",
      }
    );
};
