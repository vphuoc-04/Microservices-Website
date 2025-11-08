// Configs
import { authServiceInstance } from '../configs/axios';

// Helpers
import { handleAxiosError } from "../helpers/axiosHelper";
import { me } from './UserService';

type RegisterPayload = {
    firstName: string,
    middleName: string | null,
    lastName: string,
    email: string,
    phone: string,
    password: string,
}

type LoginPayload = {
    email: string, 
    password: string,
}

const customerRegister = async (payload: RegisterPayload): Promise<boolean> => {
    try {
        const response = await authServiceInstance.post('/auth/register', {
            firstName: payload.firstName,
            middleName: payload.middleName,
            lastName: payload.lastName,
            email: payload.email,
            phone: payload.phone,
            password: payload.password
        })
        return response.data;

    } catch (error) {
        handleAxiosError(error);
        return false;
    }
}

const login = async (payload:LoginPayload): Promise<boolean> => {
    try {
        const response = await authServiceInstance.post('/auth/login', {
            email: payload.email,
            password: payload.password
        })

        const user = await me();

        if (response?.data) {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('refresh_token', response.data.data.refreshToken);
        }

        return true;

    } catch (error) {
        handleAxiosError(error);
        return false;
    }
}

const logout = async (): Promise<boolean> => {
    try {
        await authServiceInstance.get("/auth/logout");

        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");

        return true;
    } catch (error) {
        handleAxiosError(error);
        return false;
    }
};

export { login, logout, customerRegister }