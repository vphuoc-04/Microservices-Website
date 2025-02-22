import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    withCredentials: true, 
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
});

const refreshToken = async () => {
    try {

        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
            console.error("Refresh token not found");
            return null;
        }

        const response = await axios.post("http://localhost:8080/api/v1/auth/refresh_token", { 
                refreshToken 
            },
            {
                withCredentials: true
            }
        );

        console.log("Response:", response.data);

        if (response?.data.data.token && response?.data.data.refreshToken) {
            localStorage.setItem("token", response.data.data.token);

            localStorage.setItem("refresh_token", response.data.data.refreshToken);

            return response.data.data.token; 
        }

        return null;
    } catch (error) {
        console.log("Refresh token failed", error);
        localStorage.removeItem("user")
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        return null;
    }
};

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; 

            const newToken = await refreshToken(); 
            console.log("New token after refresh:", newToken);
            
            if (newToken) {
                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${newToken}`
                };
                return axiosInstance(originalRequest);
            }
        }

        return Promise.reject(error);
    }
);

axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
