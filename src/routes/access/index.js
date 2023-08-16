import express from "express";
import accessController from "../../controllers/access.controller.js";
const accessRouter = express.Router();

//signup
accessRouter.post("/shop/signup", accessController.signup);

export default accessRouter;
