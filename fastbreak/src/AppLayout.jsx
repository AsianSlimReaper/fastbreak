import React, { useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";

function AppLayout({ children }) {
    //initialize the navigate function from react-router-dom
    const navigate = useNavigate();

    // Function to handle logout and redirect to login page
    const logout = () => {
        // Clear local storage items related to authentication
        localStorage.removeItem("access_token");
        localStorage.removeItem('user');
        localStorage.removeItem('teams');
        // Optionally, you can clear any other related data
        alert("Your session has expired. Please log in again.");

        // Redirect to the login page
        navigate("/login");
    };

    // Effect to check the token expiration and handle logout if expired
    useEffect(() => {
        // Get the access token from local storage
        const token = localStorage.getItem("access_token");

        // If token exists, decode it and check expiration
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now();

                // Check if the token is expired
                if (decoded.exp * 1000 < currentTime) {
                    // Token is expired, call logout
                    logout();
                } else {
                    // If token is valid, set a timeout to logout when it expires
                    const timeout = decoded.exp * 1000 - currentTime;
                    setTimeout(() => {
                        logout();
                    }, timeout);
                }
            } catch (error) {
                // If there's an error decoding the token, log it and call logout
                console.error("Invalid token:", error);
                logout();
            }
        }
    }, []); // Empty dependency array to run only once on mount

    return (
        <>
            {children}
        </>
    );
}

export default AppLayout;
