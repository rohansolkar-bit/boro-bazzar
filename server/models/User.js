import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmpassword: {
        type: String,
        required: true
    },
    verify_email: {
        type : Boolean,
        default : false
    },
    accessToken: {
        type: String,
        default: "",
    },
     refreshToken: {
        type: String,
        default: "",
    },
    otp :{
        type : String,
    },
    otpExpiration: {
        type: Date,
    },
    lastLogin: {
        type: Date,
    },
}, {
    timestamps: true,
}
);    

export const User = mongoose.model("User", userSchema);