// Configs
import axiosInstance from "../configs/axios";

// Helpers
import { handleAxiosError } from "../helpers/axiosHelper";

// Types
import { UserCatalogue } from "../types/UserCatalogue";


const fetchUserCatalogue = async(): Promise<UserCatalogue[]> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found");
            return [];
        }

        const resposne = await axiosInstance.get('/user_catalogue', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        console.log("User cataloge: ", resposne.data.data)

        return resposne.data.data.content

    } catch (error) {
        handleAxiosError(error);
        return [];
    }
}

export { fetchUserCatalogue }