import express from "express";
import {
    addAdminEmailController,
    getAllAdminEmailsController,
    removeAdminEmailController,
    checkIsAdminEmailController,
} from "../controller/adminEmailMaster.controller.js";
import { verifyAdmin } from "../middleware/productMiddleware.js";

const router = express.Router();

// Public — used by frontend login flow to determine role
router.get("/check", checkIsAdminEmailController);

// Protected — only existing admins can manage the master list
router.post("/add",           verifyAdmin, addAdminEmailController);
router.get("/all",            verifyAdmin, getAllAdminEmailsController);
router.delete("/remove/:id",  verifyAdmin, removeAdminEmailController);

export default router;
