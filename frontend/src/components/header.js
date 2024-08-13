import React, { useState, useEffect } from 'react';
import '../App.css';

import Register from './register';
import Login from './login';

function Header() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/checkauth', { method: 'GET' });
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/logout', { method: 'POST' });
      if (response.ok) {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };





  return (
    <div className="container-header">
      <h1>Zerdee</h1>
      <nav>
        {!isAuthenticated ? (
          <>
            <button onClick={() => setShowLogin(!showLogin)}>Login</button>
            <button onClick={() => setShowRegister(!showRegister)}>Register</button>
            {showLogin && <Login onLoginSuccess={checkAuthStatus} />}
            {showRegister && <Register onRegisterSuccess={checkAuthStatus} />}
          </>
        ) : (
          <>
            <a href="/profile">My Account</a>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>
    </div>
  );
}
export default Header;
