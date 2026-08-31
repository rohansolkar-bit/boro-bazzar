import express from "express";
import {
    createProductController,
    getAllProductsController,
    getProductByIdController,
    updateProductController,
    deleteProductController,
} from "../controller/product.controller.js";
import { verifyAdmin, validateProduct } from "../middleware/productMiddleware.js";

const router = express.Router();

// Public routes
router.get("/all",  getAllProductsController);
router.get("/:id",  getProductByIdController);

// Protected routes (Admin only)
router.post("/create",  createProductController);
router.put("/update/:id",      verifyAdmin, validateProduct, updateProductController);
router.delete("/delete/:id", deleteProductController);

export default router;
