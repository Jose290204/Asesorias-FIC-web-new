import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import AvisoInstalarApp from './components/ui/AvisoInstalarApp.jsx'
import InvitacionAvisos from './components/ui/InvitacionAvisos.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { FacultadActivaProvider } from './context/FacultadActivaContext.jsx'
import './index.css'


// Si la app se abrio desde una notificacion push (estando cerrada), se guarda el aviso antes de que
// el router redirija y se pierda el ?aviso=. La campanita lo recoge cuando ya hay sesion.
(() => {
  const params = new URLSearchParams(window.location.search)
  const aviso = params.get('aviso')
  if (!aviso) return
  try {
    sessionStorage.setItem('aviso_pendiente', aviso)
  } catch {
    /* sin almacenamiento */
  }
  params.delete('aviso')
  const resto = params.toString()
  window.history.replaceState(null, '', window.location.pathname + (resto ? '?' + resto : '') + window.location.hash)
})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <AuthProvider>
            <FacultadActivaProvider>
                <App />
                <AvisoInstalarApp />
                <InvitacionAvisos />
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
