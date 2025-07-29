import React, { useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";

function AppLayout({ children }) {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem('user');
        localStorage.removeItem('teams');
        alert("Your session has expired. Please log in again.");
        navigate("/login");
    };

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now();

                if (decoded.exp * 1000 < currentTime) {
                    logout();
                } else {
                    const timeout = decoded.exp * 1000 - currentTime;
                    setTimeout(() => {
                        logout();
                    }, timeout);
                }
            } catch (error) {
                console.error("Invalid token:", error);
                logout();
            }
        }
    }, []);

    return (
        <>
            {children}
        </>
    );
}

export default AppLayout;
