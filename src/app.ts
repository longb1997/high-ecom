import compression from "compression";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import "dotenv/config";
import router from "./routes";

export const app = express();

//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
//init db
import("./dbs/init.mongodb");

//init router
app.use("/", router);

//handle error
