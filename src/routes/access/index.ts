import * as express from "express";

import accessController from "../../controllers/access.controller";
const accessRouter = express.Router()

//signup
accessRouter.post("/shop/signup", accessController.signup);

export default accessRouter;
