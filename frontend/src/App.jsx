import { useState, useEffect } from 'react';
import { api, getToken, setToken, clearToken } from './api';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('fp_user');
    if (saved && getToken()) setUser(JSON.parse(saved));
  }, []);

  const handleAuth = (data) => {
    setToken(data.token);
    localStorage.setItem('fp_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem('fp_user');
    setUser(null);
  };

  return user ? (
    <Dashboard user={user} onLogout={handleLogout} />
  ) : (
    <Login onAuth={handleAuth} />
  );
}
