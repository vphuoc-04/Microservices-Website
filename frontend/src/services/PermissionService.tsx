// Configs
import { PayloadInputs } from '@/types/Permission';
import { permissionServiceInstance } from '../configs/axios';

// Helpers
import { handleAxiosError } from "../helpers/axiosHelper";

// Bases
import { basePagination, baseRemove, baseSave } from '@/bases/BaseService';

const model = 'permissions';

export interface PermissionService {
    id: number;
    name: string;
    description?: string;
    publish: number;
}

const pagination = async (queryString: string) => {
    return basePagination(permissionServiceInstance, model, queryString).then(result => ({
        permissions: result.items,
        pagination: result.pagination
    }));
};

const save = async (payload: PayloadInputs, updateParams: { action: string, id: string | null }) => {    
    return baseSave(permissionServiceInstance, model, payload, updateParams);
};

const remove = async(id: string) => {
    return baseRemove(permissionServiceInstance, model, id);
}

export const getPermissionById = async (id: string): Promise<PermissionService | null> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return null;
        const response = await permissionServiceInstance.get(
            `/permissions/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data.data || null;
    } catch (error) {
        handleAxiosError(error);
        return null;
    }
};

export const getAllPermissions = async (): Promise<PermissionService[]> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return [];
        const response = await permissionServiceInstance.get(
            '/permissions/get_all',
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data.data || [];
    } catch (error) {
        handleAxiosError(error);
        return [];
    }
};


export {
    model,
    pagination,
    save,
    remove
};