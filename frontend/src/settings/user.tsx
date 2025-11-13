import React from 'react';
import { FaRedo } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { BaseSetting } from '@/bases/BaseSetting';
import { User } from "@/types/User";
import { genders } from '@/constants/generals';
import Recovery from '@/pages/admins/users/user/includes/Recovery';
import { ActionParam } from '@/interfaces/BaseSettingInterface';

class UserSetting extends BaseSetting<User> {
    breadcrumb = this.createBreadcrumb(
        "Người Dùng",
        "Quản Lý Người Dùng",
        "QUẢN LÝ DANH SÁCH NGƯỜI DÙNG",
        "Hiển thị danh sách thành viên, sử dụng các chức năng bên dưới để lọc theo mong muốn.",
        {
            desStyle: 'text-teal-600',
            viewTitle: "XEM THÔNG TIN NGƯỜI DÙNG",
            viewDescription: "Thông tin người dùng chỉ có thể xem, không thể chỉnh sửa"
        }
    );

    tableColumn = [
        {
            name: '',
            render: (item: User) => (
                <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full border-[1px]">
                    <Avatar>
                        {item.imgUrl 
                            ? <AvatarImage className='flex items-center justify-center w-[40px] h-[40px] rounded-full border-[1px]' src={item.imgUrl} alt="avatar" /> 
                            : <AvatarFallback />
                        }
                    </Avatar>
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
    ];

    buttonActions = [
        ...this.createDefaultButtonActions().map(action => ({
            ...action,
            path: `/user${action.path}`,
            className: action.className === 'bg-[#f8ac59]' ? 'bg-[#f8ac59] mr-[10px]' : action.className
        })),
        {
            path: '/user/recovery',
            icon: <FaRedo className='text-white'/>,
            className: 'bg-[#1e9dc7]',
            method: 'change-password',
            params: ['id', 'handleDialog:f', 'changePassword:f', 'Recovery:c'] as ActionParam[],
            component: Recovery, 
            onClick: (id: string, handleDialog: Function, changePassword: Function, Recovery: React.ComponentType<any>) => {
                handleDialog(id, changePassword, Recovery);
            }
        }
    ];
}

export const userSetting = new UserSetting();
export const { breadcrumb, tableColumn, buttonActions } = userSetting;