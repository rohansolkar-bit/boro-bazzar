import api from "@/utils/AxiosAPICall";
import Cookies from "js-cookie";

/**
 * Create a new product (Admin only)
 * @param {Object} productData
 * @param {string} productData.title
 * @param {string} productData.description
 * @param {number} productData.price
 * @param {number} productData.discount
 * @param {number} productData.stock
 * @param {string} productData.category
 * @param {string} [productData.subCategory]
 * @param {string} productData.brand
 * @param {boolean} [productData.isFeatured]
 * @param {{ count: number }} [productData.rating]
 * @param {Array<{ url: string, public_id?: string }>} [productData.images]
 */
export const createProduct = async (productData) => {
    try {
        const token = Cookies.get("accessToken");

        const response = await api.post(
            "/api/products/create",
            productData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                withCredentials: false,
            }
        );

        return response.data;
    } catch (error) {
        console.error("createProduct error:", error);
        throw error;
    }
};

/**
 * Get all products (public, supports pagination + filters)
 * @param {{ category?: string, brand?: string, search?: string, page?: number, limit?: number }} params
 */
export const getAllProducts = async (params = {}) => {
    try {
        const response = await api.get("/api/products/all", {
            params,
            withCredentials: false,
        });

        return response.data;
    } catch (error) {
        console.error("getAllProducts error:", error);
        throw error;
    }
};

/**
 * Get single product by ID (public)
 * @param {string} id
 */
export const getProductById = async (id) => {
    try {
        const response = await api.get(`/api/products/${id}`, {
            withCredentials: false,
        });

        return response.data;
    } catch (error) {
        console.error("getProductById error:", error);
        throw error;
    }
};

/**
 * Update a product (Admin only)
 * @param {string} id
 * @param {Object} updateData
 */
export const updateProduct = async (id, updateData) => {
    try {
        const token = Cookies.get("accessToken");

        const response = await api.put(
            `/api/products/update/${id}`,
            updateData,
            {
                headers: {
                    // Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                withCredentials: false,
            }
        );

        return response.data;
    } catch (error) {
        console.error("updateProduct error:", error);
        throw error;
    }
};

/**
 * Delete a product (Admin only)
 * @param {string} id
 */
export const deleteProduct = async (id) => {
    try {
        const token = Cookies.get("accessToken");

        const response = await api.delete(`/api/products/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: false,
        });

        return response.data;
    } catch (error) {
        console.error("deleteProduct error:", error);
        throw error;
    }
};
