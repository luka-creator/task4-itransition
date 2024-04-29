import React, { useState, useEffect } from 'react';
import { registerWithEmailAndPassword, loginWithEmailAndPassword, logout, auth } from './authService';
import './App.css';
import UserManagement from './UserManagement'; 

function App() {
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [error, setError] = useState(null);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [registerName, setRegisterName] = useState(''); 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        setUser(authUser);
        setShowUserManagement(true); 
      } else {
        setUser(null);
        setShowUserManagement(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerWithEmailAndPassword(registerEmail, registerPassword,registerName);
      setRegisterName(''); 
      setRegisterEmail('');
      setRegisterPassword('');
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginWithEmailAndPassword(loginEmail, loginPassword); 
      setLoginEmail('');
      setLoginPassword('');
      setError(null);
      setShowUserManagement(true); 
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setShowUserManagement(false);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="App">
      <div>
        {user ? (
          <div>
            <h2>Welcome, {user.email}</h2>
            <button onClick={handleLogout}>Logout</button>
            {showUserManagement && <UserManagement />}
          </div>
        ) : (
          <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
              <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
              <button type="submit">Login</button>
            </form>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
              <input type="email" placeholder="Email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required />
              <input type="password" placeholder="Password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required />
              <button type="submit">Register</button>
            </form>
            {error && <p>{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;