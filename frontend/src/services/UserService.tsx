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


const getAllUser = async (page: number, perPage: number = 10, sort: string = "id,asc") => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found");
            return null;
        }

        const response = await axiosInstance.get(`/get_all_user`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, perpage: perPage, sort },
        });

        console.log("API Response:", response.data); 

        if (response.data && response.data.success) {
            return {
                users: response.data.data.content, 
                totalPages: response.data.data.totalPages, 
                totalElements: response.data.data.totalElements, 
                currentPage: response.data.data.number + 1, 
            };
        } else {
            console.error("Invalid API response structure:", response.data);
            return null;
        }
    } catch (error) {
        console.error("Failed to fetch users", error);
        return null;
    }
};

export { 
    fetchUser, 
    getAllUser 
};
