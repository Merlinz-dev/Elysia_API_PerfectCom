import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { classTest1, classTest2 } from "../../controller/controllerMain";
import { data, dataUser } from "../../DataType";

export const MainRoutes_GET = (app: Elysia) => {
  app
    .use(
      jwt({
        name: "myJWTNamespace",
        secret: Bun.env["TOKEN_SECRET"] || "secret",
        exp: "2h"
      })
    )
    .get(
      "/api/v1/GetUser/:UserID",
      ({
        controllerMain_Test2,
        params
      }: {
        controllerMain_Test2: classTest2;
        params: { UserID: string };
      }) => controllerMain_Test2.GetUser(params.UserID),
      {
        detail: {
          tags: ["Api_Get"]
        }
      }
    );
};
