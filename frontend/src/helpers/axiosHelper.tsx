import axios from "axios"
import { toast } from "react-toastify"

const handleAxiosError = (error:unknown):void => {
    if (axios.isAxiosError(error)) {
        if (error.response && error.response.data && error.response.data.error) {
            toast.error(error.response.data.error.message);
        } else {
            toast.error("Network error")
        }
    } else {
        toast.error("Errorr");
    }
}

export { handleAxiosError }