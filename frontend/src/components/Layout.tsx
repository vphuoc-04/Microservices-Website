import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Helpers
import { showToast } from "../helpers/myHelper";

// Redux
import { RootState } from "../redux/store";
import { clearToast } from "../redux/slice/toastSlice";

// components
import { Aside } from "./aside";
import { Header } from "./header";

const Layout: React.FC = () => {
    const dispatch = useDispatch();
    const { message, type } = useSelector((state: RootState) => state.toast);

    useEffect(() => {
        showToast(message, type);
        dispatch(clearToast());
    }, [message, type, dispatch]);

    return (
        <div className="page">
            <Aside />
            <div className="main-content">
                <Header />
                <Outlet />
            </div>
        </div>
    );
};

export { Layout };