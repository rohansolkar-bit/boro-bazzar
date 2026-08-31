import express from "express";
import {  changePasswordController, forgotPasswordController, loginUserController, logoutUserController, registerUserController, verifyEmailController, verifyForgotPasswordController } from "../controller/userAth.controller.js";

const router = express.Router();

router.post("/register-user", registerUserController);
router.post("/verify-email", verifyEmailController);
router.post("/login", loginUserController);
router.post("/logout", logoutUserController);
router.post("/forgot-password", forgotPasswordController);
router.post("/verify-forgot-password-otp", verifyForgotPasswordController);
router.post("/forgot-password/change-password", changePasswordController );

export default router;