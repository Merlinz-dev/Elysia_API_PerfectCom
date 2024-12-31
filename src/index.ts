import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

// *************** Class ***************
import { classTest1, classTest2 } from "./controller/controllerMain";
// *************** Routes ***************
import { MainRoutes_GET } from "./Routes/Routes_GET/Routes_Main_V1";
import { MainRoutes_POST } from "./Routes/Routes_POST/Routes_Main_V1";
import { MainRoutes_PUT } from "./Routes/Routes_PUT/Routes_Main_V1";
import { MainRoutes_DELETE } from "./Routes/Routes_DELETE/Routes_Main_V1";

const PORT_Main = Bun.env["PORT_Main"] || 3000;

const app = new Elysia();


async function main() {
  try {
    // FIXME: Port 5000 || 3000
    MainRoutes_GET(app);
    MainRoutes_POST(app);
    MainRoutes_PUT(app);
    // MainRoutes_DELETE(app);
    app
      .use(
        swagger({
          documentation: {
            info: {
              title: "ElysiaJS Main API Documentation",
              version: "1.0.0",
            },
            tags: [
              { name: "Api_Get", description: "General endpoints" },
              { name: "Api_Post", description: "General endpoints" },
              { name: "Api_Put", description: "General endpoints" },
              { name: "Api_Delete", description: "General endpoints" },
            ],
          },
        })
      )
      .use(
        cors({
          origin: '*',
          methods: ["GET", "POST", "PUT", "DELETE"],
          allowedHeaders: ["Content-Type", "Authorization"],
          // credentials: true,
        })
      )
      .decorate("controllerMain_Test1", new classTest1())
      .decorate("controllerMain_Test2", new classTest2())
      .listen(PORT_Main, () => {
        console.log(
          `🦊 Elysia ( Main API ) is running at server-port : ${PORT_Main}`
        );
      });

  } catch (error) {
    console.error("Elysia Error:", error);
  }
}


main();

export {
  app,
};
