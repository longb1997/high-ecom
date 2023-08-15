import { app } from "./src/app.js";

const PORT = 3005;

const server = app.listen(PORT, () => {
  console.log("WSV eCommerge start with port: ", PORT);
});

//use ctr+C to exit server
process.on("SIGINT", () => {
  server.close(() => {
    console.log("WSG eCommerge exit");
  });
});
