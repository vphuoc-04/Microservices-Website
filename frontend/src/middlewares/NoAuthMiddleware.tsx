import { PropsWithChildren, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Redux
import { RootState } from "../redux/store";

type ProtectedRouteProps = PropsWithChildren;

const NoAuthMiddleware = ({ children }: ProtectedRouteProps) => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        // If authenticated, redirect to dashboard
        if (isAuthenticated && user) {
            navigate('/admin/dashboard');
        }
    }, [isAuthenticated, user, navigate]);

    // If authenticated, don't render children
    if (isAuthenticated && user) {
        return null;
    }

    return children;
};



export default NoAuthMiddleware;