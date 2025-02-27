import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'

import { store } from './redux/store'
import { Provider } from 'react-redux'

import { ToastContainer } from 'react-toastify'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Middlewares
import NoAuthMiddleware from './middlewares/NoAuthMiddleware.tsx'
import AuthMiddleware from './middlewares/AuthMiddleware.tsx'

// Components
import LayoutDashboard from './components/dashboard/layout.tsx'
import LayoutCustomer from './components/customer/layout.tsx'

// Admin pages
import LoginDashboard from './pages/dashboard/Login.tsx'
import DashboardPanel from './pages/dashboard/Dashboard.tsx'
import { View } from './pages//dashboard/users/user/View.tsx'
import { Catalogue } from './pages/dashboard/users/catalogue/Catalogue.tsx'

// Customer pages
import LoginCustomer from './pages/customer/Login.tsx'
import RegisterCustomer from './pages/customer/Register.tsx'
import Home from './pages/customer/Home.tsx'

const router = createBrowserRouter([
  {
    path: '/admin/login',
    element: (
      <NoAuthMiddleware>
        <LoginDashboard />
      </NoAuthMiddleware>
    )
  },
  {
    path: '/admin',
    element: (
      <AuthMiddleware>
        <LayoutDashboard />
      </AuthMiddleware>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPanel /> },

      // User
      { path: 'user/index', element: <View /> },
      { path: 'user/catalogue', element: <Catalogue /> }
    ]
  },

  {
    path: '/login', 
    element: (
      <NoAuthMiddleware>
        <LoginCustomer />
      </NoAuthMiddleware>
    )
  },
  {
    path: '/register',
    element: (
      <NoAuthMiddleware>
        <RegisterCustomer />
      </NoAuthMiddleware>
    )
  },
  {
    path: '/',
    element: (
      <AuthMiddleware>
        <LayoutCustomer />
      </AuthMiddleware>
    ),
    children: [
      { path: '/', element: <Home /> }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer position='top-center' />
  </Provider>
)
