import { apiKeySchema } from "../models/apiKey.model.js";
import crypto from "crypto";
class ApiService {
  static findById = async (key) => {
    // const newKey = await apiKeySchema.create({
    //   key: crypto.randomBytes(64).toString("hex"),
    //   permissions: ["0000"],
    // });
    // console.log({ newKey });
    const objKey = await apiKeySchema.findOne({ key, status: true }).lean();
    return objKey;
  };
}
export default ApiService;
