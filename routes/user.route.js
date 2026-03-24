import { Router } from "express";
import { changePassword, forgotPassword, loginUser, signup, singleUser, verifyUser, updatePassword, updateUserProfile, deleteUser, updateUserData, referralCode, affiliatedUsers, search} from "../controllers/user.controller.js";
import {authenticate} from "../middlewares/authorization.js";

const userRouter = Router();

userRouter.route("/user").post(signup);

userRouter.route("/user/login").post(loginUser);
userRouter.route("/user/verify").patch(verifyUser);
userRouter.route("/user/forget-pass").post(forgotPassword);
userRouter.route("/user/change/:id").patch(changePassword);
userRouter.route("/user").get(authenticate, singleUser);
userRouter.route("/user/pass").patch(authenticate, updatePassword);
userRouter.route("/user/").patch(authenticate, updateUserProfile);
userRouter.route("/user/:id").delete( deleteUser);
userRouter.route("/users/:id").patch( updateUserData);
userRouter.route("/users/ref/:user").get( referralCode);
userRouter.route("/users/affiliates").get(authenticate, affiliatedUsers);
userRouter.route("/users/search").post(authenticate, search)

export default userRouter;
