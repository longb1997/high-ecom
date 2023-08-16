import { app } from "./src/app.js";
import { envConfig } from "./src/configs/config.mongodb.js";

const PORT = envConfig.app.port || 3005;

const server = app.listen(PORT, () => {
  console.log("WSV eCommerge start with port: ", PORT);
});

//use ctr+C to exit server
process.on("SIGINT", () => {
  server.close(() => {
    console.log("WSG eCommerge exit");
  });
});
