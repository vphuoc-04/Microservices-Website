import React, { JSX } from 'react';
import { FaEdit, FaRegTrashAlt, FaSearch } from "react-icons/fa";

// Types
import { UserCatalogue } from "@/types/UserCatalogue";

// Hooks
import { Sheet } from '@/hooks/useSheet';

const breadcrumb = {
    items: [
        {
            title: "Người Dùng",
            route: ""
        },
        {
            title: "Quản Lý Nhóm Người Dùng",
            route: "/admin/user/catalogue"
        }
    ],
    page: {
        title: "QUẢN LÝ DANH SÁCH NHÓM NGƯỜI DÙNG",
        description: "Hiển thị danh sách nhóm thành viên, sử dụng các chức năng bên dưới để lọc theo mong muốn"
    },
    create: {
        title: "THÊM MỚI NHÓM NGƯỜI DÙNG",
        description: "Nhập đầy đủ các thông tin phía dưới. Các mục có dấu * là bắt buộc."
    },
    update: {
        title: "CHỈNH SỬA NHÓM NGƯỜI DÙNG",
        description: "Chỉnh sửa các thông tin phía dưới. Các mục có dấu * là bắt buộc."
    },
    view: {
        title: "XEM THÔNG NHÓM TIN NGƯỜI DÙNG",
        description: "Thông tin người dùng chỉ có thể xem, không thể chỉnh sửa"
    }
};

interface tableColumn {
    name: string,
    className?: string,
    render: (item: UserCatalogue) => JSX.Element
}

const tableColumn: tableColumn[] = [
    {
        name: 'ID',
        render: (item: UserCatalogue) => <span>{item.id}</span>
    },
    {
        name: 'Tên nhóm',
        render: (item: UserCatalogue) => <span>{item.name}</span>
    },
    {
        name: 'Người tạo',
        render: (item: UserCatalogue) => <span>{item.addedBy}</span>
    },
    {
        name: 'Người sửa',
        render: (item: UserCatalogue) => <span>{item.editedBy}</span>
    },
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