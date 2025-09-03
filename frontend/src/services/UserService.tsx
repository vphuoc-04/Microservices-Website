import React, { JSX } from 'react';
import { FaEdit, FaRegTrashAlt, FaSearch } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

// Configs
import { userServiceInstance } from '../configs/axios';

// Helpers
import { handleAxiosError } from "../helpers/axiosHelper";

// Types
import { PayloadInputs, User } from "@/types/User";

// Interfaces
import { UpdateStatusByFieldParam } from '@/interfaces/BaseServiceInterface';

// Constants
import { genders } from '@/constants/generals';

// Services
import { fetchUserCatalogue } from './UserCatalogueService';
import { Sheet } from '@/hooks/useSheet';


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

const pagination = async (queryString: string) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found");
            return null;
        }

        const response = await userServiceInstance.get(`/users/get_all_user?${queryString}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const pageData = response.data?.data;

        const catalogues = await fetchUserCatalogue();
        const catalogueMap = new Map(catalogues.map(c => [c.id, c.name]));
        
        return {
            users: (pageData?.content || []).map((u: any) => ({
                ...u,
                userCatalogueIds: u.userCatalogueIds?.[0] || 0,
                userCatalogueName: catalogueMap.get(u.userCatalogueIds?.[0]) || "Không có nhóm"
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

const getUserById = async (userId: string | null): Promise<User> => {
    const response =  await userServiceInstance.get(`/users/${userId}`)

    return response.data;
}
 
const create = async (payload: PayloadInputs) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token không tồn tại");
            return null;
        }

        const response = await userServiceInstance.post(
            `/users/create`, 
            payload, {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        return response.data;
    } catch (error) {
        handleAxiosError(error);
        throw error;
    }
};

const update = async (id: string | null, payload: PayloadInputs) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token không tồn tại");
            return null;
        }

        const response = await userServiceInstance.put(
            `/users/update/${id}`, 
            payload, {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        return response.data;
    } catch (error) {
        handleAxiosError(error);
        throw error;
    }
};

const view = async (id: number) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token không tồn tại");
            return null;
        }

        const response = await userServiceInstance.post(
            `/users/view/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        return response.data;
    } catch (error) {
        handleAxiosError(error);
        throw error;
    }
};


const remove = async (id: number) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token không tồn tại");
            return null;
        }

        const response = await userServiceInstance.delete(
            `/users/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        return response.data;
    } catch (error) {
        handleAxiosError(error);
        throw error;
    }
};

const model = 'users';

const breadcrumb = {
    items: [
        {
            title: "User",
            route: ""
        },
        {
            title: "Quản lý người dùng",
            route: "/admin/user/users"
        }
    ],
    page: {
        title: "QUẢN LÝ DANH SÁCH NGƯỜI DÙNG",
        description: "Hiển thị danh sách thành viên, sử dụng các chức năng bên dưới để lọc theo mong muốn"
    },
    create: {
        title: "THÊM MỚI NGƯỜI DÙNG",
        description: "Nhập đầy đủ các thông tin phía dưới. Các mục có dấu * là bắt buộc."
    },
    update: {
        title: "CHỈNH SỬA THÔNG TIN NGƯỜI DÙNG",
        description: "Chỉnh sửa các thông tin phía dưới. Các mục có dấu * là bắt buộc."
    },
    view: {
        title: "XEM THÔNG TIN NGƯỜI DÙNG",
        description: "Thông tin người dùng chỉ có thể xem, không thể chỉnh sửa"
    }
};

interface tableColumn {
    name: string,
    render: (item: User) => JSX.Element
}

const tableColumn: tableColumn[] = [
    {
        name: 'ID',
        render: (item: User) => (
            <div className="flex items-center">
                <Avatar>
                    {item.img ? <AvatarImage src={item.img} alt='avatar'/> : <AvatarFallback></AvatarFallback>}
                </Avatar>
                <span>{item.id}</span>
            </div>
        )
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
    },
    {
        name: 'Ngày sinh',
        render: (item: User) => <span>{item.birthDate ? item.birthDate : "Không rõ"}</span>
    },
    {
        name: 'Giới tính',
        render: (item: User) => {
            const gender = genders.find(g => g.id === item.gender);
            return <span>{gender ? gender.name : "Không rõ"}</span>;
        }
    },
    {
        name: 'Nhóm thành viên',
        render: (item: User) => <span>{item.userCatalogueName}</span>
    }
]


export type Row = Record<string, any>
export type OpenSheetFunction = (sheet: Sheet) => void
export type ActionParam = keyof Row | `${string}:f`

export type ParamToType<T extends ActionParam> =
    T extends `${string}:f` ? Function :
    T extends keyof Row ? Row[T] : never;

export type ParamsToTuple<T extends ActionParam[]> = {
    [K in keyof T]: ParamToType<T[K]> 
}

export interface ButtonAction<T extends ActionParam[]>{
    onClick?: (...agrs: ParamsToTuple<T>) => void,
    params?: T,  
    className?: string,
    icon?: React.ReactNode,
    path?: string,
    method?: string
}

const buttonActions: ButtonAction<ActionParam[]>[] = [
    {
        path: '/users/update',
        icon: <FaEdit className='text-white'/>,
        className: 'flex bg-teal-600 mr-[10px]',
        method: 'update',
        params: ['id', 'name', 'openSheet:f'],
        onClick: (id: string, name: string, openSheet: OpenSheetFunction) => {
            openSheet({ open: true, action: 'update', id: id })
        }
    },
    {
        path: '/users/delete',
        icon: <FaRegTrashAlt className='text-white'/>,
        className: 'bg-[#ec4758] mr-[10px]',
        method: 'delete',
        params: ['id', 'handleAlertDialog:f', 'remove:f', ],
        onClick: (id: string, handleAlertDialog: any, remove: any) => {
            handleAlertDialog(id, remove)
        }
    },
    {
        path: '/users/view',
        icon: <FaSearch className='text-white'/>,
        className: 'bg-[#f8ac59]',
        method: 'view',
        params: ['id', 'openSheet:f'],
        onClick: (id: string, openSheet: OpenSheetFunction) => {
            openSheet({ open: true, action: 'view', id: id })
        }
    }
]

export { 
    me, 
    pagination, 
    deleteMany,
    updateStatusByField,
    updateFieldByParams,
    create,
    getUserById,
    update,
    view,
    remove,
    breadcrumb, 
    model, 
    tableColumn,
    buttonActions
};
