import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    withCredentials: true, 
    headers: {
        "Content-Type": "application/json"
    }
})

axiosInstance.interceptors.response.use(
    response => {
        return response.data ?? response
    },
    error => {
        // if (error.response) {
        //     const { status, data } = error.response;

        //     if (status === 401) {
        //         //
        //     }

        //     return Promise.reject(data.error.message);
        // }

        return Promise.reject(error)
    }

)

export default axiosInstance