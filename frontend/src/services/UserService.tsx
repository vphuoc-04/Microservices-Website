// Configs
import { userServiceInstance } from '../configs/axios';

// Helpers
import { handleAxiosError } from "../helpers/axiosHelper";

// Types
import { PayloadInputs, User } from "@/types/User";

// Interfaces
import { UpdateStatusByFieldParam } from '@/interfaces/BaseServiceInterface';

// Services
import { fetchUserCatalogue } from './UserCatalogueService';

import { baseRemove, baseSave } from './BaseService';

const model = 'users';

const me = async(): Promise<User | null> => {
    try {
        const response = await userServiceInstance.get("/users/me",);
        return response.data.data

    } catch (error) {
        handleAxiosError(error)
        return null
    }
}

const pagination = async (queryString: string) => {
    try {
        const response = await userServiceInstance.get(`/users/get_all_user?${queryString}`);
        const pageData = response.data?.data;

        const catalogues = await fetchUserCatalogue();
        const catalogueMap = new Map(catalogues.map(c => [c.id, c.name]));
        
        return {
            users: (pageData?.content || []).map((u: any) => ({
                ...u,
                userCatalogueId: u.userCatalogueId?.[0] || 0,
                userCatalogueName: catalogueMap.get(u.userCatalogueId?.[0]) || "Không có nhóm"
            })),
            pagination: {                    
                totalPages: pageData?.totalPages,
                totalElements: pageData?.totalElements,
                page: pageData?.number,
                size: pageData?.size,
                last: pageData?.last
            }
        };
    } catch (error) {
        handleAxiosError(error)
        return { users: [], pagination: null };
    }
};

const deleteMany = async (ids: number[]) => {
    try {
        const response = await userServiceInstance.delete(`/users/delete_many`, { data: ids });

        return response.data;
    } catch (error) {
        handleAxiosError(error);
        throw error;
    }
};

const updateStatusByField = async ({id, publish, column, model}: UpdateStatusByFieldParam) => {
    try {

        const response = await userServiceInstance.put(`/users/${id}/publish`, { publish, column, model });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
        throw error;
    }
};

const updateFieldByParams = async (ids: number[], model: string, publish: number) => {
    try {
        const response = await userServiceInstance.put(`/users/update_field`, { 
            ids, 
            publish, 
            column: 'publish', 
            model 
        });

        return response.data;
    } catch (error) {
        handleAxiosError(error);
        throw error;
    }
};

const getUserById = async (userId: string | null): Promise<User> => {
    const response =  await userServiceInstance.get(`/users/${userId}`)

    return response.data.data;
}
 
const save = async (payload: PayloadInputs, updateParams: { action: string, id: string | null }) => {    
    return baseSave(userServiceInstance, model, payload, updateParams)
};

const remove = async (id: string) => {
   return baseRemove(userServiceInstance, model, id);
};


const view = async (id: number) => {
    try {
        const response = await userServiceInstance.get(
            `/users/view/${id}`
        );

        console.log(response.data.data);

        return response.data;
    } catch (error) {
        handleAxiosError(error);
        throw error;
    }
};

export { 
    model,
    me, 
    pagination, 
    deleteMany,
    updateStatusByField,
    updateFieldByParams,
    save,
    getUserById,
    view,
    remove
};
