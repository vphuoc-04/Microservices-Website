import React, { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Helpers
import { showToast } from "../../helpers/myHelper";

// Redux
import { RootState } from "../../redux/store";
import { clearToast } from "../../redux/slice/toastSlice";

// components
import { Aside } from "./aside";
import { Header } from "./header";
import CustomAlertDialog from "../customs/CustomAlertDialog";
import useDialog from "@/hooks/useDialog";

const Layout: React.FC = () => {
    const dispatch = useDispatch();
    const { message, type } = useSelector((state: RootState) => state.toast);
    const lastToastRef = useRef<string>("");

    useEffect(() => {
        if (message && type && message !== lastToastRef.current) {
            lastToastRef.current = message;
            showToast(message, type);
            dispatch(clearToast());
        }
    }, [message, type, dispatch]);


    return (
        <div className="flex h-screen overflow-hidden">
            <Aside />
            <div className="flex-1 bg-gray-100 flex flex-col">
                <Header />
                <div className="flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;