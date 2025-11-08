// Configs
import { permissionServiceInstance } from '../configs/axios';

// Helpers
import { handleAxiosError } from "../helpers/axiosHelper";

// Bases
import { basePagination } from '@/bases/BaseService';

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

export const createPermission = async (name: string, publish: number, description?: string): Promise<boolean> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return false;
        const response = await permissionServiceInstance.post(
            "/permissions/create",
            { name, publish, description },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data && response.data.success;
    } catch (error) {
        handleAxiosError(error);
        return false;
    }
};

export const updatePermission = async (id: string, name: string, publish: number, description?: string): Promise<boolean> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return false;
        const response = await permissionServiceInstance.put(
            `/permissions/update/${id}`,
            { name, publish, description },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data && response.data.success;
    } catch (error) {
        handleAxiosError(error);
        return false;
    }
};

export const deletePermission = async (id: number): Promise<boolean> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return false;
        const response = await permissionServiceInstance.delete(
            `/permissions/delete/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data && response.data.success;
    } catch (error) {
        handleAxiosError(error);
        return false;
    }
};

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
    pagination
};