import { Router } from "express";
import {authenticate} from "../middlewares/authorization.js";
import { invest } from "../controllers/invest-controller.js";

const investRoute = Router();

// investRoute.route("/invest").post(authenticate, invest);

export default investRoute;
