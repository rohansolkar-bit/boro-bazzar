import mongoose from 'mongoose';

const adminEmailMasterSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
        },
        addedBy: {
            type: String,
            trim: true,
            default: 'system',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const AdminEmailMaster = mongoose.model('AdminEmailMaster', adminEmailMasterSchema);
