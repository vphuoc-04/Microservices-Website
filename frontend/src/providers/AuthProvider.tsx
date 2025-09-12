import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setAuthLogin, setAuthLogout } from "../redux/slice/authSlice";
import { me } from "../services/UserService";

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const initializeAuth = async () => {
            if (!user) {
                try {
                    const userData = await me();
                    if (userData) {
                        dispatch(setAuthLogin(userData));
                    } else {
                        dispatch(setAuthLogout());
                    }
                } catch (error) {
                    console.log('Auth initialization error:', error);
                    dispatch(setAuthLogout());
                }
            }
        };

        initializeAuth();
    }, [dispatch, user]);

    return <>{children}</>;
};

export default AuthProvider;
