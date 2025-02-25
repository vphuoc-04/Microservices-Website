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
import { Layout } from './components/dashboard/layout.tsx'

// Pages
import { Login } from './pages/dashboard/Login.tsx'
import { Dashboard } from './pages/dashboard/Dashboard.tsx'
import { View } from './pages//dashboard/users/user/View.tsx'
import { Catalogue } from './pages/dashboard/users/user/Catalogue.tsx'

const router = createBrowserRouter([
  {
    path: '/admin/login',
    element: (
      <NoAuthMiddleware>
        <Login />
      </NoAuthMiddleware>
    )
  },
  {
    path: '/admin',
    element: (
      <AuthMiddleware>
        <Layout />
      </AuthMiddleware>
    ),
    children: [
      { path: 'dashboard', element: <Dashboard /> },

      // User
      { path: 'user/index', element: <View /> },
      { path: 'user/catalogue', element: <Catalogue /> }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer position='top-center' />
  </Provider>
)
