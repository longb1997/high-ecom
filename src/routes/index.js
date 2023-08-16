"use strict";
import express from "express";
import accessRouter from "./access/index.js";
const router = express.Router();

router.use("/v1/api/", accessRouter);
// route.get("", (req, res, next) => {
//   return res.status(200).json({
//     messasge: "Welcome",
//   });
// });

export default router;
