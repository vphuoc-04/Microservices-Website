import { RouterProvider } from 'react-router-dom'
import { router } from './layouts/Layout'
import { ToastContainer } from 'react-toastify'

function App() {
    return (
        <div className="App">
            <RouterProvider router={router} />
            <ToastContainer 
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                pauseOnHover={false}
            />
        </div>
    )
}

export default App
