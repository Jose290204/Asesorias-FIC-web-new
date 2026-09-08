import { useState } from 'react';
import Login from './pages/Login';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (user, nip) => {
    if(user && nip){
      setIsLoggedIn(true)
    }
    /*
    const handleLogout = () => {
      setIsLoggedIn(false)
    }
      */
  }


  return (
    <div>
      { isLoggedIn ? (
        <inicioAdmin/>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  )
}

