import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authSuccess } from "../redux/userRelated/userSlice";


function AuthSuccess() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAuthUser = async () => {
            try {
                // Call backend to get user info from HttpOnly cookie
                const res = await axios.get("https://localhost:5000/auth/me", {
                    withCredentials: true,
                });

                if (res.data?.user) {
                    const user = res.data.user;
                    // Save minimal client-side state
                    localStorage.setItem("user", JSON.stringify(user));
                    // Update redux state
                    dispatch(authSuccess(user));
                    // Redirect to app
                    navigate('/');
                    return;
                }
            } catch (err) {
                // ignore and redirect to home/login
            }
            navigate('/');
        };

        fetchAuthUser();
    }, [navigate, dispatch]);

    return <p>Logging you in...</p>;
}

export default AuthSuccess;
