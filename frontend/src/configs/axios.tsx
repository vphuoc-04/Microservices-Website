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
        return response.data ? response.data : response
    },
    error => {
        const { response } = error;

        if (response.status === 401) {
            //
        }

        return Promise.reject(error)
    }

)

export default axiosInstance