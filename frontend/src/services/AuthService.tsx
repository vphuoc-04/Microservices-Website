// Configs
import axiosInstance from "../configs/axios";

// Helpers
import { handleAxiosError } from "../helpers/axiosHelper";

type LoginPayload = {
    email: string, 
    password: string,
}

const login = async (payload:LoginPayload): Promise<boolean> => {
    try {
        const response = await axiosInstance.post('/auth/login', {
            email: payload.email,
            password: payload.password
        })

        if (response?.data) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token)
        }

        console.log(response);

        return true;

    } catch (error) {
        handleAxiosError(error);
        return false;
    }
    
}

export { login }