import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { FacultadActivaProvider } from './context/FacultadActivaContext.jsx'
import './index.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
        <AuthProvider>
            <FacultadActivaProvider>
                <App />
            </FacultadActivaProvider>
        </AuthProvider>
    </StrictMode>
)
