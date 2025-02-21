import { PropsWithChildren, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Redux
import { RootState } from "../redux/store";
import { setAuthLogin, setAuthLogout } from "../redux/slice/authSlice";

// Services
import { fetchUser } from "../services/UserService";

type ProtectedRouteProps = PropsWithChildren;

const AuthMiddleware = ({ children }: ProtectedRouteProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const checkAuthenticate = async () => {
            if (!isAuthenticated || !user) {
                const userData = await fetchUser();
    
                console.log("✅ Fetched user data:", userData);

                if (userData) {
                    dispatch(setAuthLogin(userData));
                } else {
                    console.warn("⚠ No user data found, logging out.");
                    dispatch(setAuthLogout());
                    navigate("/admin/login");
                }
            }
        };
    
        checkAuthenticate();
    }, [isAuthenticated, user, dispatch, navigate]);
    
    
    return isAuthenticated && user ? children : null;
};

export default AuthMiddleware;
