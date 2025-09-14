// Configs
import { userCatalogueServiceInstance } from '../configs/axios';

// Helpers
import { handleAxiosError } from "../helpers/axiosHelper";

// Types
import { UserCatalogue } from "../types/UserCatalogue";

const model = 'user_catalogue';

const fetchUserCatalogue = async(): Promise<UserCatalogue[]> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found");
            return [];
        }

        const resposne = await userCatalogueServiceInstance.get('/user_catalogue/get_all_catalogue', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return resposne.data.data.content

    } catch (error) {
        handleAxiosError(error);
        return [];
    }
}

const createUserCatalogue = async(name: string, publish: string, users: number[], permissions: number[]): Promise<boolean> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found");
            return false;
        }

        const response = await userCatalogueServiceInstance.post(
            "/user_catalogue/create_catalogue", { 
                name, 
                publish,
                users,
                permissions
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return true;

    } catch (error) {
        handleAxiosError(error);
        return false;
    }
}

const updateUserCatalogue = async(id: number, name: string, publish: string): Promise<boolean> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found");
            return false;
        }

        const response = await userCatalogueServiceInstance.put(
            `/user_catalogue/update_catalogue/${id}`,
            { 
                name, 
                publish 
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return true;

    } catch (error) {
        handleAxiosError(error);
        return false;
    }
}

const deleteUserCatalogue = async (id: string): Promise<boolean> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found");
            return false;
        }

        const response = await userCatalogueServiceInstance.delete(`/user_catalogue/delete_catalogue/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return true;
    } catch (error) {
        handleAxiosError(error);
        return false;
    }
};

export { 
    model,
    fetchUserCatalogue,
    createUserCatalogue,
    updateUserCatalogue,
    deleteUserCatalogue,
}