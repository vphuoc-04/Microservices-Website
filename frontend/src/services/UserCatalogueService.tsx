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

const updateUserCatalogue = async(id: string, name: string, publish: string): Promise<boolean> => {
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

const getUserCatalogueById = async (id: string): Promise<UserCatalogue | null> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return null;
        
        const response = await userCatalogueServiceInstance.get(
            `/user_catalogue/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data.data || null;
    } catch (error) {
        handleAxiosError(error);
        return null;
    }
};

// const getUserCatalogueByIdFromList = async (id: string): Promise<UserCatalogue | null> => {
//     try {
//         const catalogues = await fetchUserCatalogue();
//         return catalogues.find(catalogue => catalogue.id === id) || null;
//     } catch (error) {
//         handleAxiosError(error);
//         return null;
//     }
// };


export const getUserCataloguePermissions = async (catalogueId: string): Promise<number[]> => {
  const response = await userCatalogueServiceInstance.get(`/user_catalogue_permission/by-catalogue/${catalogueId}`)
  return response.data
}

// Lấy users của user catalogue  
export const getUserCatalogueUsers = async (catalogueId: string): Promise<number[]> => {
  const response = await userCatalogueServiceInstance.get(`/user_catalogue_user/by-catalogue/${catalogueId}`)
  return response.data
}

export { 
    model,
    fetchUserCatalogue,
    createUserCatalogue,
    updateUserCatalogue,
    deleteUserCatalogue,
    getUserCatalogueById,
}