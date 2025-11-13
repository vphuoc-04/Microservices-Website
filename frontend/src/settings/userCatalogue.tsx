import { BaseSetting } from '@/bases/BaseSetting';
import { UserCatalogue } from "@/types/UserCatalogue";

class UserCatalogueSetting extends BaseSetting<UserCatalogue> {
    breadcrumb = this.createBreadcrumb(
        "Người Dùng",
        "Quản Lý Nhóm Người Dùng",
        "QUẢN LÝ DANH SÁCH NHÓM NGƯỜI DÙNG",
        "Hiển thị danh sách nhóm thành viên, sử dụng các chức năng bên dưới để lọc theo mong muốn"
    );

    tableColumn = [
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
        }
    ];

    buttonActions = this.createDefaultButtonActions().map(action => ({
        ...action,
        path: `/user-catalogue${action.path}`
    }));
}

export const userCatalogueSetting = new UserCatalogueSetting();
export const { breadcrumb, tableColumn, buttonActions } = userCatalogueSetting;