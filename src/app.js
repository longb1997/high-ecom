import compression from "compression";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

export const app = express();

//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
//init db
import("./dbs/init.mongodb.js");
//init router
app.get("/", (req, res, next) => {
  return res.status(200).json({
    messasge: "Welcome",
  });
});

//handle error
