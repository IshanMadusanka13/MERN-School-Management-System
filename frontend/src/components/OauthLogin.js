import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


function AuthSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            // Decode the JWT to get user info
            const user = jwtDecode(token);

            // Save token & user details in localStorage
            localStorage.setItem("authToken", token);
            localStorage.setItem("user", JSON.stringify(user));

            console.log("Logged in user:", user);

            // Redirect to dashboard
            window.location.href = "/";
        }
    }, [navigate]);

    return <p>Logging you in...</p>;
}

export default AuthSuccess;
