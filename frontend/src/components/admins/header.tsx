//
import { useNavigate } from "react-router-dom";

// Components
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

// Types

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
    // User data comes from Redux to avoid duplicate /me calls

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const authUser = useSelector((state: RootState) => state.auth.user)


    const logoutHandler = async () => {
        const result = await logout();

        if (result) {
            dispatch(setAuthLogout());
            navigate('/admin/login');
        }
    }

    return (
        <div className="bg-white h-12 flex justify-end pr-5 relative shadow-md">
            <div className="relative mt-1 mr-10 cursor-pointer">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="w-[40px] h-[40px] cursor-pointer">
                        <AvatarImage
                            src={authUser?.img ? authUser?.img : "https://github.com/shadcn.png"}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
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
