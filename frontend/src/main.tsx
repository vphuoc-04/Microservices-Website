import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'

import { store } from './redux/store'
import { Provider } from 'react-redux'

import { ToastProvider } from './contexts/ToastContext.tsx'
import { ToastContainer } from 'react-toastify'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Middlewares
import NoAuthMiddleware from './middlewares/NoAuthMiddleware.tsx'
import AuthMiddleware from './middlewares/AuthMiddleware.tsx'

// Components
import { Layout } from './components/Layout.tsx'

// Pages
import { Login } from './pages/Login.tsx'
import { Dashboard } from './pages/Dashboard.tsx'

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
      {
        path: 'dashboard',
        element: <Dashboard />
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
      <ToastProvider>
        <RouterProvider router={router} />
        <ToastContainer position='top-center' />
    </ToastProvider>
  </Provider>
)
