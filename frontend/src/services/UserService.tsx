// Configs
import axiosInstance from "../configs/axios";

// Helpers
import { handleAxiosError } from "../helpers/axiosHelper";

// Types
import { User } from "../types/User";

const fetchUser = async(): Promise<User | null> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found");
            return null;
        }

        const response = await axiosInstance.get("/user", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("User data: ", response.data.data)

        return response.data.data


    } catch (error) {
        handleAxiosError(error)
        return null
    }
}

export { fetchUser }