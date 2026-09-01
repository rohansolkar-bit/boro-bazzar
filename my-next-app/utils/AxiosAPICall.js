import axios from "axios";

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? "http://localhost:5000" : process.env.NEXT_PUBLIC_API_URL || "https://boro-bazzar-backens.vercel.app",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Holds the showError function injected from ApiErrorProvider
let _showError = null;

export function setApiErrorHandler(fn) {
  _showError = fn;
}

const STATUS_MESSAGES = {
  400: "Bad request. Please check your input.",
  401: "Unauthorised. Please log in again.",
  403: "You don't have permission to do that.",
  404: "Resource not found.",
  409: "Conflict — this record already exists.",
  422: "Validation error. Please check your input.",
  429: "Too many requests. Please slow down.",
  500: "Server error. Please try again later.",
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const serverMessage = error?.response?.data?.message;
    const message =
      serverMessage ||
      STATUS_MESSAGES[status] ||
      (error.code === "ECONNABORTED" ? "Request timed out." : "Network error. Check your connection.");

    if (_showError) {
      _showError(message, "error");
    }

    return Promise.reject(error);
  }
);

export default api;
