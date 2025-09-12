import { useNavigate } from "react-router-dom";

// Services
import { logout } from "../../services/AuthService";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { setAuthLogout } from "../../redux/slice/authSlice";
import { RootState } from "@/redux/store";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

const Header = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const authUser = useSelector((state: RootState) => state.auth.user)

    const logoutHandler = async () => {
        const result = await logout();

        if (result) {
            dispatch(setAuthLogout());
            navigate('/login');
        }
    }

    return (
        <div className="bg-white h-15 flex justify-between relative border-b-4 relative w-full">
            <a className="w-12 mt-2 ml-15" href="/">
                <img src="https://imgur.com/M7Hsxrq.png" alt="" />
            </a>
            <div className="relative mr-15 cursor-pointer p-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <img
                            src="https://i.pinimg.com/736x/73/79/8c/73798c5c5dfb267fce136b18cf1a259c.jpg"
                            alt="Avatar"
                            className="w-10 h-10 rounded-full cursor-pointer"
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                        <DropdownMenuLabel>{authUser?.firstName} {authUser?.middleName} {authUser?.lastName}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">Billing</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">Team</DropdownMenuItem>
                        <DropdownMenuItem onClick={logoutHandler} className="cursor-pointer">
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
        
    );
};

export { Header };
