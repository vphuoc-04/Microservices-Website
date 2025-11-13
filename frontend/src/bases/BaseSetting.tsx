import { 
    BaseSettingConfig, 
    BreadcrumbConfig, 
    TableColumn, 
    ButtonAction, 
    ActionParam 
} from '@/interfaces/BaseSettingInterface';

import { FaEdit, FaRegTrashAlt, FaSearch } from "react-icons/fa";

export abstract class BaseSetting<T = any> implements BaseSettingConfig<T> {
    abstract breadcrumb: BreadcrumbConfig;
    abstract tableColumn: TableColumn<T>[];
    abstract buttonActions: ButtonAction<ActionParam[]>[];

    protected createDefaultButtonActions(): ButtonAction<ActionParam[]>[] {
        return [
            {
                path: '/update',
                icon: this.createEditIcon(),
                className: 'flex bg-teal-600 mr-[10px]',
                method: 'update',
                params: ['id', 'name', 'openSheet:f'] as ActionParam[],
                onClick: (id: string, name: string, openSheet: any) => {
                    console.log(id, name);
                    openSheet({ open: true, action: 'update', id: id });
                }
            },
            {
                path: '/delete',
                icon: this.createDeleteIcon(),
                className: 'bg-[#ec4758] mr-[10px]',
                method: 'delete',
                params: ['id', 'handleAlertDialog:f', 'remove:f'] as ActionParam[],
                onClick: (id: string, handleAlertDialog: any, remove: any) => {
                    handleAlertDialog(id, remove);
                }
            },
            {
                path: '/view',
                icon: this.createViewIcon(),
                className: 'bg-[#f8ac59]',
                method: 'view',
                params: ['id', 'openSheet:f'] as ActionParam[],
                onClick: (id: string, openSheet: any) => {
                    openSheet({ open: true, action: 'view', id: id });
                }
            }
        ];
    }

    protected createEditIcon(): React.ReactNode {
        return <FaEdit />; 
    }

    protected createDeleteIcon(): React.ReactNode {
        return <FaRegTrashAlt />
    }

    protected createViewIcon(): React.ReactNode {
        return <FaSearch />; 
    }


    protected createBreadcrumb(
        mainTitle: string,
        mainRoute: string,
        pageTitle: string,
        pageDescription: string,
        options?: {
            desStyle?: string;
            createTitle?: string;
            createDescription?: string;
            updateTitle?: string;
            updateDescription?: string;
            viewTitle?: string;
            viewDescription?: string;
        }
    ): BreadcrumbConfig {
        return {
            items: [
                {
                    title: mainTitle,
                    route: ""
                },
                {
                    title: mainRoute,
                    route: `/admin/${mainTitle.toLowerCase()}/${mainRoute.toLowerCase()}`
                }
            ],
            page: {
                title: pageTitle,
                description: pageDescription,
                desStyle: options?.desStyle
            },

            create: {
                title: options?.createTitle || `THÊM MỚI ${mainTitle.toUpperCase()}`,
                description: options?.createDescription || "Nhập đầy đủ các thông tin phía dưới. Các mục có dấu * là bắt buộc."
            },

            update: {
                title: options?.updateTitle || `CHỈNH SỬA ${mainTitle.toUpperCase()}`,
                description: options?.updateDescription || "Chỉnh sửa các thông tin phía dưới. Các mục có dấu * là bắt buộc."
            },
            
            view: {
                title: options?.viewTitle || `XEM THÔNG TIN ${mainTitle.toUpperCase()}`,
                description: options?.viewDescription || "Thông tin chỉ có thể xem, không thể chỉnh sửa"
            }
        };
    }
}