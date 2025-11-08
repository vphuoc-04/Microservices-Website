import React, { JSX } from 'react';
import { FaEdit, FaRegTrashAlt, FaSearch } from "react-icons/fa";

// Types
import { Permission } from "@/types/Permission";

// Hooks
import { Sheet } from '@/hooks/useSheet';


const breadcrumb = {
    items: [
        {
            title: "Phân Quyền",
            route: ""
        },
        {
            title: "Quản Lý Phân Quyền",
            route: "/admin/permission/permissions"
        }
    ],
    page: {
        title: "QUẢN LÝ PHÂN QUYỀN",
        description: "Hiển thị danh sách quyền, sử dụng các chức năng bên dưới để phân quyền"
    },
    create: {
        title: "THÊM MỚI QUYỀN",
        description: "Nhập đầy đủ các thông tin phía dưới. Các mục có dấu * là bắt buộc."
    },
    update: {
        title: "CHỈNH SỬA QUYỀN",
        description: "Chỉnh sửa các thông tin phía dưới. Các mục có dấu * là bắt buộc."
    },
    view: {
        title: "XEM THÔNG THÔNG TIN QUYỀN",
        description: "Thông tin người dùng chỉ có thể xem, không thể chỉnh sửa"
    }
};

interface tableColumn {
    name: string,
    className?: string,
    render: (item: Permission) => JSX.Element
}

const tableColumn: tableColumn[] = [
    {
        name: 'ID',
        render: (item: Permission) => <span>{item.id}</span>
    },
    {
        name: 'Tên quền',
        render: (item: Permission) => <span>{item.name}</span>
    },
    {
        name: 'Mô tả quyền',
        render: (item: Permission) => <span>{item.description}</span>
    },
    {
        name: 'Người thêm',
        render: (item: Permission) => <span>{item.addedBy}</span>
    },
    {
        name: 'Người sửa',
        render: (item: Permission) => <span>{item.editedBy ? item.editedBy : "Chưa có ai sửa"}</span>
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