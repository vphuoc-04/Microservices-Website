import { JSX } from 'react';
import { FaEdit, FaRegTrashAlt, FaSearch } from "react-icons/fa";

// Configs
import { userServiceInstance } from '../configs/axios';

// Helpers
import { handleAxiosError } from "../helpers/axiosHelper";

// Types
import { User } from "../types/User";
import { UpdateStatusByFieldParam } from '@/interfaces/BaseServiceInterface';

const me = async(): Promise<User | null> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found");
            return null;
        }

        const response = await userServiceInstance.get("/users/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data

    } catch (error) {
        handleAxiosError(error)
        return null
    }
}

const pagination = async (page: number | null) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found");
            return null;
        }

        const response = await userServiceInstance.get(`/users/get_all_user?page=${page}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const pageData = response.data?.data;

        return {
            users: pageData?.content || [],   
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
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found");
            return null;
        }

        const response = await userServiceInstance.delete(`/users/delete_many`, {
            headers: { Authorization: `Bearer ${token}` },
            data: ids 
        });

        return response.data;
    } catch (error) {
        handleAxiosError(error);
        throw error;
    }
};

const updateStatusByField = async ({id, publish, column, model}: UpdateStatusByFieldParam) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token không tồn tại");
            return null;
        }

        const response = await userServiceInstance.put(`/users/${id}/publish`, { publish, column, model }, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        handleAxiosError(error);
        throw error;
    }
};

const updateFieldByParams = async (ids: number[], model: string, publish: number, refetch: () => void) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token không tồn tại");
            return null;
        }

        const response = await userServiceInstance.put(`/users/update_field`, { 
            ids, 
            publish, 
            column: 'publish', 
            model 
        }, {
            headers: { Authorization: `Bearer ${token}` },
        });

        refetch();
        return response.data;
    } catch (error) {
        handleAxiosError(error);
        throw error;
    }
};

const model = 'users';

const breadcrumb = [
  {
    title: "User",
    route: ""
  },
  {
    title: "Quản lý người dùng",
    route: "/admin/user/users"
  }
]

interface tableColumn {
    name: string,
    render: (item: User) => JSX.Element
}

const tableColumn: tableColumn[] = [
    {
        name: 'ID',
        render: (item: User) => <span>{item.id}</span>
    },
    {
        name: 'Họ',
        render: (item: User) => <span>{item.lastName}</span>
    },
    {
        name: 'Tên đệm',
        render: (item: User) => <span>{item?.middleName}</span>
    },
    {
        name: 'Tên',
        render: (item: User) => <span>{item.firstName}</span>
    },
    {
        name: 'Email',
        render: (item: User) => <span>{item.email}</span>
    },
    {
        name: 'Số điện thoại',
        render: (item: User) => <span>{item.phone}</span>
    }
]

const buttonActions = [
    {
       path: '/users/update',
       icon: <FaEdit className='text-white'/>,
       className: 'flex bg-teal-600 mr-[10px]'
    },
    {
       path: '/users/delete',
       icon: <FaRegTrashAlt className='text-white'/>,
       className: 'bg-[#ec4758] mr-[10px]'
    },
    {
       path: '/users/view',
       icon: <FaSearch className='text-white'/>,
       className: 'bg-[#f8ac59]'
    }
]

export { 
    me, 
    pagination, 
    deleteMany,
    updateStatusByField,
    updateFieldByParams,
    breadcrumb, 
    model, 
    tableColumn,
    buttonActions
};
