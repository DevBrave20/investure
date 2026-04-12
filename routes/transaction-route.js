import { Router } from "express";
import {authenticate, authenticateAdmin} from "../middlewares/authorization.js";
import  validator from "../middlewares/validator.js"
import { confirmPayment, deposit, depositTransactions, listAllTransactions, userTransactionHistory } from "../controllers/transaction-controller.js";
import uploadImage from "../helpers/file-upload.js";
import { invest } from "../controllers/invest-controller.js";

import { createTransactionnPin, updatePaymentPin, validatePaymentPin } from "../controllers/user.controller.js";
import paymentPinValidations from "../schemas/transaction-validations.js";

const transactionRoute = Router();
transactionRoute.route("/invest").post(authenticate, invest);

transactionRoute.route("/deposit").post(authenticate, deposit);

transactionRoute.route("/confirm/:id").post(confirmPayment);

transactionRoute.route("/transactions").get(listAllTransactions);
transactionRoute.route("/transactions/users").get(authenticate, userTransactionHistory);

transactionRoute.route("/pin").post(validator(paymentPinValidations) ,authenticate,createTransactionnPin);

transactionRoute.route("/pin").patch(validator(paymentPinValidations), authenticate ,updatePaymentPin);

transactionRoute.route("/transactions/pin").post(validator(paymentPinValidations) ,  authenticate ,validatePaymentPin);

transactionRoute.route("/transactions/deposit").get(authenticateAdmin, depositTransactions)

export default transactionRoute;
