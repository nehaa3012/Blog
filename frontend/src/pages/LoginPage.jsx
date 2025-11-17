import React from "react";
import LoginCardSection from "../components/login-signup";
import { useNavigate } from "react-router-dom";
import API from "../config/api";

function LoginPage() {
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            const response = await API.post("/api/auth/logout", { withCredentials: true });
            console.log(response.data);
            if(response.status === 200){
                navigate("/");
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }
    return (
        <div >
            <LoginCardSection handleLogout={handleLogout}/>
        </div>
    );
}

export default LoginPage;
