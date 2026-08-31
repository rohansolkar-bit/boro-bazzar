import jwt from "jsonwebtoken";

const auth = async (request, response, next) => {
    try {
        // Get token from cookie or Authorization header
        const token =
            request.cookies?.accessToken ||
            request.headers?.authorization?.split(" ")[1];

        if (!token) {
            return response.status(401).json({
                success: false,
                error: true,
                message: "Provide token",
            });
        }

        // Verify token
        const decoded = await jwt.verify(
            token,
            process.env.SECRET_KEY_ACCESS_TOKEN
        );

        if (!decoded) {
            return response.status(401).json({
                success: false,
                error: true,
                message: "Unauthorized access",
            });
        }

        // Store user details in request
        request.userId = decoded.id;
        request.email = decoded.email;

        next();
    } catch (error) {
        return response.status(401).json({
            success: false,
            error: true,
            message: error.message || "Invalid or expired token",
        });
    }
};

export default auth;