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
            console.log(error);
        }
        finally {
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

