import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Helpers
import { showToast } from "../../helpers/myHelper";

// Redux
import { RootState } from "../../redux/store";
import { clearToast } from "../../redux/slice/toastSlice";

const Dashboard = () => {
    const { message, type } = useSelector((state: RootState) => state.toast);

    const dispatch = useDispatch();

    useEffect(() => {
        showToast(message, type)
        dispatch(clearToast())
    }, [message, type, dispatch])

    return (
        <div>
            Dashboard
        </div>
    )
}

export default Dashboard