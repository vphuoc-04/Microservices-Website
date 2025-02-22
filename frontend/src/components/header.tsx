import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Types
import { User } from "../types/User";

// Services
import { logout } from "../services/AuthService";
import { fetchUser } from "../services/UserService";

// Redux
import { useDispatch } from "react-redux";
import { setAuthLogout } from "../redux/slice/authSlice";
import { useClickOutside } from "../hooks/useClickOutsite";


const Header = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchUserData = async () => {
            const userData = await fetchUser();
            setUser(userData);
        };
        fetchUserData();
    }, []);

    useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

    const logoutHandler = async () => {
        const result = await logout();

        if (result) {
            dispatch(setAuthLogout());
            navigate('/admin/login');
        }
    }

    return (
        <div className="header">
            <div className="header-content">
                <div className="avatar-container">
                    <img
                        src="https://i.pinimg.com/736x/73/79/8c/73798c5c5dfb267fce136b18cf1a259c.jpg" 
                        alt="Avatar"
                        className="header-avatar"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    />

                    {isDropdownOpen && (
                        <div className="header-profile" ref={dropdownRef}>
                            <div className="header-profile-name">
                                <p>{user?.firstName} {user?.middleName} {user?.lastName}</p>
                            </div>
                            <div className="header-profile-feature" onClick={logoutHandler}>
                                Log out
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export { Header };
