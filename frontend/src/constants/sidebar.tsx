import { FaChartPie, FaUser } from "react-icons/fa";

export const sidebarItem = [
    {
        label: 'MAIN',
        items: [
            {
                icons: <FaChartPie />,
                label: 'Dashboard',
                active: ['dashboard'],
                links: [
                    { title: 'Overview', to: '/admin/dashboard' },
                    { title: 'Details', to: '/admin/dashboard/details' }
                ] 
            }
        ]
    }, 
    {
        label: 'FEATURE',
        items: [
            {
                icons: <FaUser />,
                label: 'User',
                active: ['user'],
                links: [
                    { title: 'User management', to: '/admin/user/index' },
                    { title: 'User cataloge management', to: '/admin/user/catalogue' }
                ]
            }
        ]
    }
]