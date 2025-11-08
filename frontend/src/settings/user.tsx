import React, { JSX } from 'react';
import { FaEdit, FaRegTrashAlt, FaSearch, FaRedo } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

// Types
import { User } from "@/types/User";

// Constants
import { genders } from '@/constants/generals';

// Hooks
import { Sheet } from '@/hooks/useSheet';

// Components
import Recovery from '@/pages/admins/users/user/includes/Recovery';

const breadcrumb = {
    items: [
        {
            title: "Người Dùng",
            route: ""
        },
        {
            title: "Quản Lý Người Dùng",
            route: "/admin/user/users"
        }
    ],
    page: {
        title: "QUẢN LÝ DANH SÁCH NGƯỜI DÙNG",
        description: "Hiển thị danh sách thành viên, sử dụng các chức năng bên dưới để lọc theo mong muốn.",
        desStyle: 'text-teal-600'
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
        name: '',
        render: (item: User) => (
            //<div className="w-[10px] h-[10px]">
            <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full border-[1px]">
                <Avatar >
                    {item.imgUrl ? <AvatarImage className='flex items-center justify-center w-[40px] h-[40px] rounded-full border-[1px]' src={item.imgUrl} alt="avatar" /> : <AvatarFallback />}
            </Avatar>
            </div>
        )
    },
    // {
    //     name: 'ID',
    //     render: (item: User) => 
    //             <span>{item.id}</span>
    // },
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
export type ActionParam = keyof Row | `${string}:f` | `${string}:c`

export type ParamToType<T extends ActionParam> =
    T extends `${string}:f` ? Function :
    T extends `${string}:c` ? React.ComponentType<any> :
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
    method?: string,
    component?: React.ComponentType<any>
}

const buttonActions: ButtonAction<ActionParam[]>[] = [
    {
        path: '/users/update',
        icon: <FaEdit className='text-white'/>,
        className: 'flex bg-teal-600 mr-[10px]',
        method: 'update',
        params: ['id', 'name', 'openSheet:f'],
        onClick: (id: string, name: string, openSheet: OpenSheetFunction) => {
            console.log(id, name);
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
        className: 'bg-[#f8ac59] mr-[10px]',
        method: 'view',
        params: ['id', 'openSheet:f'],
        onClick: (id: string, openSheet: OpenSheetFunction) => {
            openSheet({ open: true, action: 'view', id: id })
        }
    },
    {
        path: '/users/recovery',
        icon: <FaRedo className='text-white'/>,
        className: 'bg-[#1e9dc7]',
        method: 'change-password',
        params: ['id', 'handleDialog:f', 'changePassword:f', 'Recovery:c'],
        component: Recovery, 
        onClick: (id: string, handleDialog: Function, changePassword: Function, Recovery: React.ComponentType<any>) => {
            handleDialog(id, changePassword, Recovery)
        }
    }
]

export {
    breadcrumb, 
    tableColumn,
    buttonActions
}