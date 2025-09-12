import axios from "axios";
import { toast } from "react-toastify";

const handleAxiosError = (error: unknown): void => {
    if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
            const data = error.response.data as { message?: string };
            if (data.message) {
                toast.error(data.message); 
            } else {
                toast.error(error.message); 
            }
        } else {
            toast.error("Network error");
        }
    } else {
        toast.error("Unexpected error");
    }
};

export { handleAxiosError };
