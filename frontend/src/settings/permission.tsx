import { BaseSetting } from '@/bases/BaseSetting';
import { Permission } from "@/types/Permission";

class PermissionSetting extends BaseSetting<Permission> {
    breadcrumb = this.createBreadcrumb(
        "Phân Quyền",
        "Quản Lý Phân Quyền",
        "QUẢN LÝ PHÂN QUYỀN",
        "Hiển thị danh sách quyền, sử dụng các chức năng bên dưới để phân quyền"
    );

    tableColumn = [
        {
            name: 'ID',
            render: (item: Permission) => <span>{item.id}</span>
        },
        {
            name: 'Tên quyền',
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
    ];

    buttonActions = this.createDefaultButtonActions().map(action => ({
        ...action,
        path: `/permission${action.path}`
    }));
}

export const permissionSetting = new PermissionSetting();
export const { breadcrumb, tableColumn, buttonActions } = permissionSetting;