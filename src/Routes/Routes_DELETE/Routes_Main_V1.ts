import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { classTest2 } from "../../controller/controllerMain";
import { data, dataUser } from "../../DataType";

export const MainRoutes_DELETE = (app: Elysia) => {
  app
    .use(
      jwt({
        name: "myJWTNamespace",
        secret: Bun.env["TOKEN_SECRET"] || "secret",
        exp: "2h"
      })
    )
    .delete(
      "/api/v1/Delete_User/:UserID",
      ({
        controllerMain_Test2,
        params
      }: {
        controllerMain_Test2: classTest2;
        params: { UserID: string };
      }) => controllerMain_Test2.Delete_User(params.UserID),
      {
        detail: {
          tags: ["Api_Delete"]
        }
      }
    )
    // *************** No DB ***************
    .delete(
      "/api/v1/Delete_User_NoDB/:UserID",
      ({
        controllerMain_Test2,
        params
      }: {
        controllerMain_Test2: classTest2;
        params: { UserID: string };
      }) => controllerMain_Test2.Delete_User_NoDB(params.UserID),
      {
        detail: {
          tags: ["Api_Delete"]
        }
      }
    );
};
