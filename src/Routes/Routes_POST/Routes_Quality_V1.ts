import { Elysia } from "elysia";
import { classDashboardQuality } from "../../controller/controllerQuality";
import { dataDashboard } from "../../DataType";
import { jwt } from "@elysiajs/jwt";

export const QualityRoutes_POST = (app: Elysia) => {
  app
    .use(
      jwt({
        name: "myJWTNamespace",
        secret: Bun.env["TOKEN_SECRET"] || "secret",
        exp: "2h",
      })
    )
    .post(
      "/api/v1/GetDashboard_Quality",
      async ({
        controllerDashboardQuality,
        body,
      }: {
        controllerDashboardQuality: classDashboardQuality;
        body: dataDashboard;
      }) => {
        const result = await controllerDashboardQuality.GetDashboard_Quality(
          body
        );
        return result;
      },
      {
        detail: {
          tags: ["Api_Post"],
          requestBody: {
            description: "Example body for GetDashboard_Quality",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    Web_Page: {
                      type: "string",
                    },
                    Display_Owner: {
                      type: "string",
                    },
                  },
                  required: ["Web_Page", "Display_Owner"],
                  example: {
                    Web_Page: "Dashboard_Quality",
                    Display_Owner: "Default",
                  },
                },
              },
            },
          },
        },
        type: "json",
      }
    )
    .post(
      "/api/v1/SaveUserSetting",
      async ({
        controllerDashboardQuality,
        body,
      }: {
        controllerDashboardQuality: classDashboardQuality;
        body: dataDashboard;
      }) => {
        const result = await controllerDashboardQuality.SaveUserSetting(body);
        return result;
      },
      {
        detail: {
          tags: ["Api_Post"],
        },
        type: "json",
      }
    )

    .post(
      "/api/v1/INSERT_SMLD_TABLE",
      async ({
        controllerDashboardQuality,
        body,
      }: {
        controllerDashboardQuality: classDashboardQuality;
        body: dataDashboard;
      }) => {
        const result = await controllerDashboardQuality.INSERT_SMLD_TABLE(body);
        return result;
      },
      {
        detail: {
          tags: ["Api_Post"],
          requestBody: {
            description: "Example body for Insert Master Target",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    InsertTable: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          Business: { type: "string" },
                          SPI_KPI: { type: "number" },
                          SPI_FPYL: { type: "number" },
                          SPI_RFYL: { type: "number" },
                          SPI_RYL: { type: "number" },
                          BRI_KPI: { type: "number" },
                          BRI_FPYL: { type: "number" },
                          BRI_RFYL: { type: "number" },
                          BRI_RYL: { type: "number" },
                          ARI_KPI: { type: "number" },
                          ARI_FPYL: { type: "number" },
                          ARI_RFYL: { type: "number" },
                          ARI_RYL: { type: "number" },
                          VI_KPI: { type: "number" },
                        },
                      },
                      required: [
                        "Business",
                        "SPI_KPI",
                        "SPI_FPYL",
                        "SPI_RFYL",
                        "SPI_RYL",
                        "BRI_KPI",
                        "BRI_FPYL",
                        "BRI_RFYL",
                        "BRI_RYL",
                        "ARI_KPI",
                        "ARI_FPYL",
                        "ARI_RFYL",
                        "ARI_RYL",
                        "VI_KPI",
                      ],
                      example: {
                        InsertTable: [
                          {
                            Business: "IM (Rigid)",
                            SPI_KPI: 10,
                            SPI_FPYL: 10,
                            SPI_RFYL: 10,
                            SPI_RYL: 10,
                            BRI_KPI: 10,
                            BRI_FPYL: 10,
                            BRI_RFYL: 10,
                            BRI_RYL: 10,
                            ARI_KPI: 10,
                            ARI_FPYL: 10,
                            ARI_RFYL: 10,
                            ARI_RYL: 10,
                            VI_KPI: 10,
                          },
                          {
                            Business: "IM (Flex)",
                            SPI_KPI: 120,
                            SPI_FPYL: 120,
                            SPI_RFYL: 120,
                            SPI_RYL: 120,
                            BRI_KPI: 120,
                            BRI_FPYL: 120,
                            BRI_RFYL: 120,
                            BRI_RYL: 120,
                            ARI_KPI: 120,
                            ARI_FPYL: 120,
                            ARI_RFYL: 120,
                            ARI_RYL: 120,
                            VI_KPI: 120,
                          },
                          {
                            Business: "CL (Rigid)",
                            SPI_KPI: 10,
                            SPI_FPYL: 10,
                            SPI_RFYL: 10,
                            SPI_RYL: 10,
                            BRI_KPI: 10,
                            BRI_FPYL: 10,
                            BRI_RFYL: 10,
                            BRI_RYL: 10,
                            ARI_KPI: 10,
                            ARI_FPYL: 10,
                            ARI_RFYL: 10,
                            ARI_RYL: 10,
                            VI_KPI: 10,
                          },
                          {
                            Business: "CL (Flex)",
                            SPI_KPI: 120,
                            SPI_FPYL: 120,
                            SPI_RFYL: 120,
                            SPI_RYL: 120,
                            BRI_KPI: 120,
                            BRI_FPYL: 120,
                            BRI_RFYL: 120,
                            BRI_RYL: 120,
                            ARI_KPI: 120,
                            ARI_FPYL: 120,
                            ARI_RFYL: 120,
                            ARI_RYL: 120,
                            VI_KPI: 120,
                          },
                          {
                            Business: "AC",
                            SPI_KPI: 2,
                            SPI_FPYL: 2,
                            SPI_RFYL: 2,
                            SPI_RYL: 2,
                            BRI_KPI: 2,
                            BRI_FPYL: 2,
                            BRI_RFYL: 2,
                            BRI_RYL: 2,
                            ARI_KPI: 2,
                            ARI_FPYL: 2,
                            ARI_RFYL: 2,
                            ARI_RYL: 2,
                            VI_KPI: 2,
                          },
                          {
                            Business: "eV",
                            SPI_KPI: 10,
                            SPI_FPYL: 10,
                            SPI_RFYL: 10,
                            SPI_RYL: 10,
                            BRI_KPI: 10,
                            BRI_FPYL: 10,
                            BRI_RFYL: 10,
                            BRI_RYL: 10,
                            ARI_KPI: 10,
                            ARI_FPYL: 10,
                            ARI_RFYL: 10,
                            ARI_RYL: 10,
                            VI_KPI: 10,
                          },
                          {
                            Business: "LF",
                            SPI_KPI: 10,
                            SPI_FPYL: 10,
                            SPI_RFYL: 10,
                            SPI_RYL: 10,
                            BRI_KPI: 10,
                            BRI_FPYL: 10,
                            BRI_RFYL: 10,
                            BRI_RYL: 10,
                            ARI_KPI: 10,
                            ARI_FPYL: 10,
                            ARI_RFYL: 10,
                            ARI_RYL: 10,
                            VI_KPI: 10,
                          },
                          {
                            Business: "MC",
                            SPI_KPI: 7,
                            SPI_FPYL: 7,
                            SPI_RFYL: 7,
                            SPI_RYL: 7,
                            BRI_KPI: 7,
                            BRI_FPYL: 7,
                            BRI_RFYL: 7,
                            BRI_RYL: 7,
                            ARI_KPI: 7,
                            ARI_FPYL: 7,
                            ARI_RFYL: 7,
                            ARI_RYL: 7,
                            VI_KPI: 7,
                          },
                          {
                            Business: "All Biz",
                            SPI_KPI: 10,
                            SPI_FPYL: 10,
                            SPI_RFYL: 10,
                            SPI_RYL: 10,
                            BRI_KPI: 10,
                            BRI_FPYL: 10,
                            BRI_RFYL: 10,
                            BRI_RYL: 10,
                            ARI_KPI: 10,
                            ARI_FPYL: 10,
                            ARI_RFYL: 10,
                            ARI_RYL: 10,
                            VI_KPI: 10,
                          },
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
        type: "json",
      }
    )
    .post(
      "/api/v1/InsertAlert",
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
        // console.log(checkAuth);
        if (body.UserID === 999) {
          const result = await controllerDashboardQuality.InsertAlert(
            body,
            body.UserID.toString()
          );
          return result;
        } else {
          if (!checkAuth) {
            set.status = 401;
            // console.log("Unauthorized");
            return "Unauthorized";
          }
          const result = await controllerDashboardQuality.InsertAlert(
            body,
            checkAuth.Employee_ID
          );
          return result;
        }
      },
      {
        detail: {
          tags: ["Api_Post"],
          requestBody: {
            description: "Example body for InsertAlert",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    Function_Name: {
                      type: "string",
                    },
                    Parameter_Name: {
                      type: "string",
                    },
                    Notify_Message: {
                      type: "string",
                    },
                    Notify_Level: {
                      type: "number",
                    },
                    UserID: {
                      type: "string",
                    },
                  },
                  required: [
                    "Function_Name",
                    "Parameter_Name",
                    "Notify_Message",
                    "Notify_Level",
                    "UserID",
                  ],
                  example: {
                    Function_Name: "ESD_Control",
                    Parameter_Name: "System",
                    Notify_Message: "Test",
                    Notify_Level: 1,
                    UserID: "22230249",
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
