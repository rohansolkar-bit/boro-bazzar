import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// Verify JWT and attach user to request
export const verifyAdmin = async (request, response, next) => {
    try {
        const token =
            request.cookies?.accessToken ||
            request.headers?.authorization?.split(" ")[1];

        if (!token) {
            return response.status(401).json({
                success: false,
                error: true,
                message: "Access token is required",
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

        if (!decoded) {
            return response.status(401).json({
                success: false,
                error: true,
                message: "Invalid or expired token",
            });
        }

        const user = await User.findById(decoded.id).select("-password -confirmpassword");

        if (!user) {
            return response.status(401).json({
                success: false,
                error: true,
                message: "User not found",
            });
        }

        if (!user.verify_email) {
            return response.status(403).json({
                success: false,
                error: true,
                message: "Email not verified",
            });
        }

        request.userId = decoded.id;
        request.email  = decoded.email;
        request.user   = user;

        next();
    } catch (error) {
        return response.status(401).json({
            success: false,
            error: true,
            message: error.message || "Unauthorized",
        });
    }
};

// Validate required product fields before create/update
export const validateProduct = (request, response, next) => {
    const { title, description, price, stock, category, brand } = request.body;

    const errors = [];

    if (!title || !title.trim())
        errors.push("Title is required");

    if (!description || !description.trim())
        errors.push("Description is required");

    if (price === undefined || price === null || isNaN(Number(price)))
        errors.push("Valid price is required");
    else if (Number(price) < 0)
        errors.push("Price cannot be negative");

    if (stock === undefined || stock === null || isNaN(Number(stock)))
        errors.push("Valid stock value is required");
    else if (Number(stock) < 0)
        errors.push("Stock cannot be negative");

    if (!category || !category.trim())
        errors.push("Category is required");

    if (!brand || !brand.trim())
        errors.push("Brand is required");

    if (request.body.discount !== undefined) {
        const d = Number(request.body.discount);
        if (isNaN(d) || d < 0 || d > 100)
            errors.push("Discount must be between 0 and 100");
    }

    if (errors.length > 0) {
        return response.status(400).json({
            success: false,
            error: true,
            message: "Validation failed",
            errors,
        });
    }

    next();
};
