import { createContext, useState, useEffect } from "react";
import API from "../config/api";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        setLoading(true);
        try {
            const response = await API.get("/api/auth/me");
            if (response) {
                setUser(response.data);
            }
        } catch (error) {
            // Silently handle 401 errors (not logged in)
            if (error.response?.status !== 401) {
                console.error("Auth error:", error);
            }
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};


