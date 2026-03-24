import { Router } from "express";
import AdminController from "../controllers/admin-controller.js";
import { authenticateAdmin } from "../middlewares/authorization.js";
import { totalAmountDeposited, totalPendingAmount } from "../controllers/transaction-controller.js";

const adminRoute = Router();
const adminControll = new AdminController();

adminRoute.route("/admin").post(adminControll.signUp);
adminRoute.route("/admin/login").post(adminControll.loginAdmin);
adminRoute.route("/admin/validate/:id").post(adminControll.validateAdmin);
adminRoute.route("/admin").get(authenticateAdmin, adminControll.admin);
adminRoute.route("/payment").post(authenticateAdmin, adminControll.uploadPaymentOptions);
adminRoute.route("/payment").get(adminControll.getAllPaymentOptions);
adminRoute.route("/method/").get(adminControll.getSinglePaymentMethod);

adminRoute.route("/admin/users").get(authenticateAdmin, adminControll.allUsers);
adminRoute.route("/admin/users/:id").get(authenticateAdmin, adminControll.singleUser);

adminRoute.route("/admin/funds").get( totalAmountDeposited );

adminRoute.route("/admin/pending").get( totalPendingAmount );

adminRoute.route("/admin/email/user/:id").post(authenticateAdmin, adminControll.sendFollowUpEmail );

export default adminRoute;
