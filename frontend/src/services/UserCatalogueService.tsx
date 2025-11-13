// Configs
import { basePagination, baseRemove, baseSave } from '@/bases/BaseService';
import { userCatalogueServiceInstance } from '../configs/axios';

// Helpers
import { handleAxiosError } from "../helpers/axiosHelper";

// Types
import { PayloadInputs, UserCatalogue } from "../types/UserCatalogue";

const model = 'user_catalogue';

const fetchUserCatalogue = async(): Promise<UserCatalogue[]> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found");
            return [];
        }

        const resposne = await userCatalogueServiceInstance.get('/user_catalogue/pagination', {
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

const pagination = (queryString: string) => {
    return basePagination(userCatalogueServiceInstance, model, queryString).then(result => ({
        user_catalogue: result.items,
        pagination: result.pagination
    }));
}

const save = async (payload: PayloadInputs, updateParams: { action: string, id: string | null }) => {    
    return baseSave(userCatalogueServiceInstance, model, payload, updateParams)
};

const remove = async (id: string) => {
    return baseRemove(userCatalogueServiceInstance, model, id)
}

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

export const getUserCataloguePermissions = async (catalogueId: string): Promise<number[]> => {
    const response = await userCatalogueServiceInstance.get(`/user_catalogue_permission/by-catalogue/${catalogueId}`)
    return response.data
}

export const getUserCatalogueUsers = async (catalogueId: string): Promise<number[]> => {
    const response = await userCatalogueServiceInstance.get(`/user_catalogue_user/by-catalogue/${catalogueId}`)
    return response.data
}

export { 
    model,
    pagination,
    save,
    remove,
    fetchUserCatalogue,
    getUserCatalogueById,
}