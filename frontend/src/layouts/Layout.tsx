import { createBrowserRouter, Outlet } from 'react-router-dom'

// Pages
import { Login } from '../pages/Login'
import { Dashboard } from '../pages/Dashboard'

const Admin = () => {
    return (
        <Outlet />
    )
}

const router = createBrowserRouter([
    {
        path: '/admin/login',
        element: <Login />
    },
    {
        path: '/admin',
        element: <Admin />,
        children: [
            {
                path: '/admin/dashboard',
                element: <Dashboard />
            }
        ]
    }
])

export { router }