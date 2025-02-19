import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.tsx'

import { store } from './redux/store'
import { Provider } from 'react-redux'

import { ToastProvider } from './contexts/ToastContext.tsx'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
      <ToastProvider>
        <App />
    </ToastProvider>
  </Provider>
)
