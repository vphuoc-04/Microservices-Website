import axios from "axios";
import { showToast } from "./myHelper";

const handleAxiosError = (error: unknown): void => {
    if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
            // Nếu backend trả về object { message: "...", error: "..." }
            const msg = error.response.data.message || error.response.data.error || "Có lỗi xảy ra";
            showToast(msg, 'error')
        } else {
            showToast(error.message, 'error')
        }
    } else {
        showToast('Đã xảy ra lỗi không xác định.', 'error');
    }
};

export { handleAxiosError };
