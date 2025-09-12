import React, { JSX } from 'react';
import { FaEdit, FaRegTrashAlt, FaSearch } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

// Types
import { PayloadInputs, User } from "@/types/User";

// Constants
import { genders } from '@/constants/generals';

// Hooks
import { Sheet } from '@/hooks/useSheet';

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
    className?: string,
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
        name: 'Giới tính',
        className: 'text-center',
        render: (item: User) => {
            const gender = genders.find(g => g.id === item.gender);
            return <span>{gender ? gender.name : "Không rõ"}</span>;
        }
    },
    {
        name: 'Ngày sinh',
        render: (item: User) => <span className='text-center'>{item.birthDate ? item.birthDate : "Không rõ"}</span>
    },
    {
        name: 'Số điện thoại',
        render: (item: User) => <span>{item.phone}</span>
    },
    {
        name: 'Email',
        render: (item: User) => <span>{item.email}</span>
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
    breadcrumb, 
    tableColumn,
    buttonActions
}