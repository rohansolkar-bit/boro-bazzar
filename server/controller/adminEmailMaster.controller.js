import { AdminEmailMaster } from "../models/AdminEmailMaster.js";

// POST /api/admin-email/add
export const addAdminEmailController = async (request, response) => {
    try {
        const { email, addedBy } = request.body;

        if (!email?.trim()) {
            return response.status(400).json({ success: false, error: true, message: "Email is required." });
        }

        const exists = await AdminEmailMaster.findOne({ email: email.toLowerCase().trim() });
        if (exists) {
            return response.status(409).json({ success: false, error: true, message: "Email already in admin master list." });
        }

        const record = await AdminEmailMaster.create({ email: email.toLowerCase().trim(), addedBy: addedBy || 'system' });

        return response.status(201).json({ success: true, error: false, message: "Admin email added.", data: record });
    } catch (error) {
        return response.status(500).json({ success: false, error: true, message: error.message });
    }
};

// GET /api/admin-email/all
export const getAllAdminEmailsController = async (request, response) => {
    try {
        const emails = await AdminEmailMaster.find().sort({ createdAt: -1 });
        return response.status(200).json({ success: true, error: false, message: "Admin emails fetched.", data: emails });
    } catch (error) {
        return response.status(500).json({ success: false, error: true, message: error.message });
    }
};

// DELETE /api/admin-email/remove/:id
export const removeAdminEmailController = async (request, response) => {
    try {
        const record = await AdminEmailMaster.findByIdAndDelete(request.params.id);
        if (!record) {
            return response.status(404).json({ success: false, error: true, message: "Record not found." });
        }
        return response.status(200).json({ success: true, error: false, message: "Admin email removed." });
    } catch (error) {
        return response.status(500).json({ success: false, error: true, message: error.message });
    }
};

// GET /api/admin-email/check?email=xxx  — used by login to determine role
export const checkIsAdminEmailController = async (request, response) => {
    try {
        const { email } = request.query;
        if (!email) {
            return response.status(400).json({ success: false, error: true, message: "Email query param required." });
        }
        const record = await AdminEmailMaster.findOne({ email: email.toLowerCase().trim(), isActive: true });
        return response.status(200).json({ success: true, error: false, isAdmin: !!record });
    } catch (error) {
        return response.status(500).json({ success: false, error: true, message: error.message });
    }
};
