"use client";
import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);
    const [email, setEmail] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isUser, setIsUser] = useState(false);
    const [mounted, setMounted] = useState(false);

    // On mount, check if accessToken cookie exists to restore auth state
    useEffect(() => {
        setMounted(true);
        const accessToken = Cookies.get("accessToken");
        const role = Cookies.get("userRole");
        if (accessToken) {
            setIsAuthenticated(true);
            setToken(accessToken);
            if (role === 'admin') setIsAdmin(true);
            else setIsUser(true);
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        setUser({});
        setIsAuthenticated(false);
        setToken(null);
        setEmail(null);
        setIsAdmin(false);
        setIsUser(false);
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("userRole");
    };

    const setAuthToken = (token) => {
        setToken(token);
    }

    const setLoadingState = (loading) => {
        setLoading(loading);
    }
    const setErrorState = (error) => {
        setError(error);
    }
    const setEmailState = (email) => {
        setEmail(email);
    }
    const setAdminState = (isAdmin) => {
        setIsAdmin(isAdmin);
    }
    const setUserState = (isUser) => {
        setIsUser(isUser);
    }

    const contextValue = {
                user,
                login,
                logout,
                isAuthenticated: mounted ? isAuthenticated : false,
                setIsAuthenticated,
                loading,
                setLoadingState,
                error,
                setErrorState,
                token,
                setAuthToken,
                email,
                setEmailState,
                isAdmin,
                setAdminState,
                isUser,
                setUserState
            }

            
            


    return (
        <AuthContext.Provider
            value={contextValue}
        >
            {children}
        </AuthContext.Provider>
    );
};