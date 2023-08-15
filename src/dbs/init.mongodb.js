import mongoose from "mongoose";

const connectString = "";

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
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

export const instanceMongoDb = Database.getInstance();
