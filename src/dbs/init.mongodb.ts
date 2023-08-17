import mongoose from "mongoose";
import { envConfig } from "../configs/config.mongodb";

const connectString = `mongodb://${envConfig.db.host}:${envConfig.db.port}/${envConfig.db.name}`;

type IDatabase = {
  instance?: any
}

class Database {
  constructor() {
    this.connect();
  }

  //connect
  connect(type = "mongodb") {
    switch (type) {
      case "mongodb":
        if (1 === 1) {
          mongoose.set("debug", true);
          mongoose.set("debug", { color: true });
        }
        mongoose
          .connect(connectString)
          .then((_) => console.log(`Connected MongoDb Success`))
          .catch((err) => console.log("Error connect", err));
        break;
      default:
        break;
    }
  }

  static getInstance() {
    //@ts-ignore
    if (!Database.instance) {
    //@ts-ignore
      Database.instance = new Database();
    }
    //@ts-ignore
    return Database.instance;
  }
}

export const instanceMongoDb = Database.getInstance();
