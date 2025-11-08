import { FaChartPie, FaUser, FaFingerprint, FaFileAlt  } from "react-icons/fa";

export const sidebarItem = [
    {
        label: 'MAIN',
        items: [
            {
                icons: <FaChartPie />,
                label: 'Dashboard',
                active: ['dashboard'],
                to: '/admin/dashboard',
                links: [
                    // { title: 'Overview', to: '/admin/dashboard' },
                    // { title: 'Details', to: '/admin/dashboard/details' }
                ] 
            }
        ]
    }, 
    {
        label: 'FEATURE',
        items: [
            {
                icons: <FaUser />,
                label: 'Người Dùng',
                active: ['user'],
                links: [
                    { title: 'Quản lý người dùng', to: '/admin/user/users' },
                    { title: 'Quản lý nhóm người dùng', to: '/admin/user/catalogue' }
                ]
            },
            {
                icons: <FaFingerprint />,
                label: 'Phân Quyền',
                active: ['permission'],
                to: '/admin/permission/permissions',
                links: [ //{ title: 'Quản lý phân quyền', to: '/admin/permission/permissions' }
                ]
            },
            {
                icons: <FaFileAlt  />,
                label: 'Tập tin',
                active: ['file'],
                to: '/admin/file/files',
                links: []
            }
        ]
    }
]