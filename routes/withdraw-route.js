import { Router } from "express";
import { authenticate } from "../middlewares/authorization.js";
import  validator from "../middlewares/validator.js"
import withdrawSchema, { withdrawProfitSchema }   from "../schemas/withdraw-schema.js";
import WithdrawControllers from "../controllers/withdraw-controller.js";

const withdrawRoute = Router();
const control = new WithdrawControllers();

withdrawRoute.route("/withdraw").post(authenticate, validator(withdrawSchema), control.withdrawToWallet);

withdrawRoute.route("/withdraw").get(authenticate, control.withdrawalHistory);

withdrawRoute.route("/withdraw/profit").post(authenticate,validator(withdrawProfitSchema), control.withdrawProfit);


export default withdrawRoute;
