import { PropsWithChildren, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Redux
import { RootState } from "../redux/store";

// Services
import { fetchUser } from "../services/UserService";

type ProtectedRouteProps = PropsWithChildren;

const NoAuthMiddleware = ({ children }: ProtectedRouteProps) => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const [checkedAuth, setCheckedAuth] = useState<boolean>(false)

    useEffect(() => {
        const checkAuthenticate = async () => {
            try {
                const userData = await fetchUser()
                if (userData !== null) {
                    navigate('/admin/dashboard')
                } else {
                    setCheckedAuth(true)
                }
            } catch (error) {
                setCheckedAuth(true)
                console.log(error)
            }
        } 

        if (!isAuthenticated || user === null) {
            checkAuthenticate();
        } else {
            navigate('/admin/dashboard')
        }

    }, [isAuthenticated, user, navigate]);

    return checkedAuth ? children : null;
};



export default NoAuthMiddleware;