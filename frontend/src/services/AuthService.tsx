import axiosInstance from "../configs/axios";

type LoginPayload = {
    email: string, 
    password: string,
}

const login = async (
    payload:LoginPayload, 
    setError: React.Dispatch<React.SetStateAction<string | null>>
): Promise<boolean> => {
    try {
        const response = await axiosInstance.post('/auth/login', {
            email: payload.email,
            password: payload.password
        })

        if (response?.data) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        console.log(response);

        return true;

    } catch (error: unknown) {
        if (error instanceof Error) {
            setError(error.message);
        } 
        return false;
    }
    
}

export { login }