import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import AvisoInstalarApp from './components/ui/AvisoInstalarApp.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { FacultadActivaProvider } from './context/FacultadActivaContext.jsx'
import './index.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
        <AuthProvider>
            <FacultadActivaProvider>
                <App />
                <AvisoInstalarApp />
            </FacultadActivaProvider>
        </AuthProvider>
    </StrictMode>
)

// Service worker (PWA): permite instalar la app y muestra una pantalla propia sin conexión
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
