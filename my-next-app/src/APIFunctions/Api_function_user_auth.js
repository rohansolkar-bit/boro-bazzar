import api from "@/utils/AxiosAPICall";
import Cookies from "js-cookie"

export const register = async (name, email, password, confirmpassword) => {
    try {
        const response = await api.post("/api/users/register-user", {
            name,
            email,
            password,
            confirmpassword,
        }, {
            withCredentials: false, // Don't send or receive cookies
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const verifyEmail = async (email, otp) => {
    try {
        const response = await api.post("/api/users/verify-email", {
            email,
            otp,
        }, {
            withCredentials: false, // Don't send or receive cookies
        });

        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const loginAPI = async (email, password) => {
    try {
        const response = await api.post("/api/users/login", {
            email,
            password,
        }, {
            withCredentials: false,
        });
        
        if (response.data.success) {
            Cookies.set("accessToken", response.data.accessToken, {
                expires: 1 / 24,
                secure: false,
                sameSite: "Lax",
            });
            Cookies.set("refreshToken", response.data.refreshToken, {
                expires: 7,
                secure: false,
                sameSite: "Lax",
            });
            // Persist role for client-side route guards
            if (response.data.role) {
                Cookies.set("userRole", response.data.role, { expires: 1 / 24, sameSite: "Lax" });
            }
        }
        
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const forgotpassword = async (email) => {
    try {
        const response = await api.post("/api/users/forgot-password", {
            email,
        }, {
            withCredentials: false, // Don't send or receive cookies
        });

        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const logoutAPI = async () => {
    try {
        const response = await api.post("/api/users/logout", {}, { withCredentials: true });
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        return response.data;
    } catch (error) {
        // Always clear cookies even if server request fails
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        throw error;
    }
};

export const changePassword = async (email, newPassword, confirmPassword) => {
    try {
        const response = await api.post("/api/users/forgot-password/change-password", {
            email,
            newPassword,
            confirmPassword,
        }, {
            withCredentials: false, // Don't send or receive cookies
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};