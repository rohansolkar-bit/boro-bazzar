import { User } from "../models/User.js";
import { AdminEmailMaster } from "../models/AdminEmailMaster.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToeken.js";
import sendEmailFun from "../config/sendEmail.js";
import emailVerificationTemplate from "../utils/verifyEmailTemplate.js";

export const registerUserController = async (request, response) => {
    try {
        const { name, email, password, confirmpassword } = request.body

        console.log(name, email, password, confirmpassword);

        if (name === "" || email === "" || password === "" || confirmpassword === "") {
            return response.status(400).json({
                success: false,
                error: true,
                message: "All fields are required",
            });
        }

        if (password !== confirmpassword) {
            return response.status(422).json({
                success: false,
                error: true,
                message: "Passwords do not match",
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });// Example

        if (userExists) {
            return response.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit verification code

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            confirmpassword: hashedPassword,
            otp: verifyCode,
            verify_email: false,
            otpExpiration: new Date(Date.now() + 10 * 60 * 1000),
        });

        await user.save();

        await sendEmailFun({
            sendTo: email,
            subject: "Verify Email form my Grocery",
            text: "",
            html: emailVerificationTemplate(name, verifyCode),
        }).catch(err => console.error("Email send failed:", err.message));
        console.log("Email send");


        const token = await jwt.sign(
            { email: user?.email, id: user?._id },
            process.env.JSON_WEB_TOKEN_SECRET_KEY,
            { expiresIn: "1h" }
        );

        return response.status(201).json({
            success: true,
            error: false,
            message: "User registered successfully",
            token: token,
        });



    } catch (error) {
        response.status(500).json({
            success: false,
            error: true,
            message: error.message || error.toString() || "Internal Server Error",
        })
    }
};

export const verifyEmailController = async (request, response) => { 
    try {
        const { email, otp } = request.body;

        if (!email || !otp) {
            return response.status(400).json({
                success: false,
                error: true,
                message: "Email and OTP are required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return response.status(404).json({
                success: false,
                error: true,
                message: "User not found",
            });
        }

        const isOtpValid = user.otp === otp
        const otpExpired = user.otpExpiration && user.otpExpiration < new Date();

        if (isOtpValid && !otpExpired) {
            user.verify_email = true;
            user.otp = null;
            user.otpExpiration = null;
            await user.save();
        }

        if (!isOtpValid) {
            return response.status(401).json({
                success: false,
                error: true,
                message: "Invalid OTP",
            });
        }

        if (otpExpired) {
            return response.status(401).json({
                success: false,
                error: true,
                message: "OTP has expired",
            });
        }




        response.status(200).json({
            success: true,
            message: "Login successful",
            user,
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            error: true,
            message: error.message,
        })
    }
};


export const loginUserController = async (request, response) => {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({
                message: "Email and Password are required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return response.status(404).json({
                success: false,
                error: true,
                message: "User not Registered",
            });
        }

        if (!user.verify_email) {
            return response.status(403).json({
                success: false,
                error: true,
                message: "Email not verified",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return response.status(401).json({
                success: false,
                error: true,
                message: "Invalid password",
            });
        }


        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        const upateUser = await User.findByIdAndUpdate(
            user._id,
            { lastLogin: new Date(), accessToken, refreshToken },
            { new: true }
        );

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None",

        };

        response.cookie("accessToken", accessToken, cookieOptions);
        response.cookie("refreshToken", refreshToken, cookieOptions);

        // Check if this email is in the admin master list
        const adminRecord = await AdminEmailMaster.findOne({
            email: upateUser.email.toLowerCase(),
            isActive: true,
        });
        const role = adminRecord ? 'admin' : 'user';

        response.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            refreshToken,
            role,
            user: {
                id:    upateUser._id,
                name:  upateUser.name,
                email: upateUser.email,
                role,
            },
        });
        
    } catch (error) {
        response.status(500).json({
            success: false,
            error: true,
            message: error.message,
        })
    }
};


export const logoutUserController = async (request, response) => {
    try {
        const userId = request.user._id;

        await User.findByIdAndUpdate(userId, {
            accessToken: "",
            refreshToken: ""
        });

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None",

        };

        response
            .clearCookie("accessToken", cookieOptions)
            .clearCookie("refreshToken", cookieOptions)
            .status(200)
            .json({
                success: true,
                error: false,
                message: "Logout successful"
            });

    } catch (error) {
        response.status(500).json({
            success: false,
            error: true,
            message: error.message
        });
    }
};


export const forgotPasswordController = async (request, response) => {
    try {
        const { email } = request.body;

        if (!email) {
            return response.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return response.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Generate 6-digit OTP
        const verifyCode = Math.floor(100000 + Math.random() * 900000);

        // OTP expires in 10 minutes
        const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = String(verifyCode);
        user.otpExpiration = otpExpiration;

        await user.save();

        await sendEmailFun({
            sendTo: email,
            subject: "Password Reset OTP - Grocery App",
            text: "",
            html: emailVerificationTemplate(user.name, verifyCode),
        }).catch(err => console.error("Forgot password email failed:", err.message));

        return response.status(200).json({
            success: true,
            error: false,
            message: "OTP sent to your email",
        });

    } catch (error) {
        return response.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const verifyForgotPasswordController = async (request, response) => {
    try {
        const { email, otp } = request.body;

        if (!email || !otp) {
            return response.status(400).json({
                success: false,
                error: true,
                message: "Email and OTP are required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return response.status(404).json({
                success: false,
                error: true,
                message: "User not found with this email",
            });
        }

        const isOtpValid = user.otp === otp
        const otpExpired = user.otpExpiration && user.otpExpiration < new Date();



        if (!isOtpValid) {
            return response.status(401).json({
                success: false,
                error: true,
                message: "Invalid OTP",
            });
        }

        if (otpExpired) {
            return response.status(401).json({
                success: false,
                error: true,
                message: "OTP has expired",
            });
        }

        if (isOtpValid && !otpExpired) {
            user.verify_email = true;
            user.otp = null;
            user.otpExpiration = null;
            await user.save();
        }




        response.status(200).json({
            success: true,
            message: "Verify Otp Sucessfully successful",
            user,
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            error: true,
            message: error.message,
        })
    }
};


export const changePasswordController = async (request, response) => {
    try {
        // const userId = request.userId; // Comes from authentication middleware

        const { email, newPassword, confirmPassword } = request.body;

        // Validate input
        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                success: false,
                error: true,
                message: "All fields are required",
            });
        }

        // Check new password confirmation
        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                success: false,
                error: true,
                message: "New password and confirm password do not match",
            });
        }

        // Find user
        const user = await User.findOne({ email});

        if (!user) {
            return response.status(404).json({
                success: false,
                error: true,
                message: "User not found",
            });
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        return response.status(201).json({
            success: true,
            error: false,
            updateEmail : user.email,
            message: "password change successfully",
        });



    } catch (error) {
        response.status(500).json({
            success: false,
            error: true,
            message: error.message || error.toString() || "Internal Server Error",
        })
    }
};

