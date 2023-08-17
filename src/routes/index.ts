import express from "express";
import accessRouter from "./access";
import { apiKey, permissions } from "../auth/checkAuth";

const router = express.Router();

// Check apiKey
router.use(apiKey);
// Check permission
router.use(permissions("0000"));

router.use("/v1/api/", accessRouter);
// route.get("", (req, res, next) => {
//   return res.status(200).json({
//     messasge: "Welcome",
//   });
// });

export default router;
