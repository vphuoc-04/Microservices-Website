import { PropsWithChildren, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Redux
import { RootState } from "../redux/store";

type ProtectedRouteProps = PropsWithChildren;

const AuthMiddleware = ({ children }: ProtectedRouteProps) => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        // If not authenticated, redirect to login
        if (!isAuthenticated || !user) {
            navigate("/admin/login");
        }
    }, [isAuthenticated, user, navigate]);

    // If not authenticated, don't render children
    if (!isAuthenticated || !user) {
        return null;
    }
    
    return children;
};

export default AuthMiddleware;
