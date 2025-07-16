import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['x-auth-token'] = token;
      try {
        const decoded = jwtDecode(token);
        setUser(decoded.user);
      } catch (error) {
        console.error('Invalid token', error);
        localStorage.removeItem('token');
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    localStorage.setItem('token', res.data.token);
    api.defaults.headers.common['x-auth-token'] = res.data.token;
    const decoded = jwtDecode(res.data.token);
    setUser(decoded.user);
  };

  const register = async (username, password) => {
    const res = await api.post('/auth/register', { username, password });
    localStorage.setItem('token', res.data.token);
    api.defaults.headers.common['x-auth-token'] = res.data.token;
    const decoded = jwtDecode(res.data.token);
    setUser(decoded.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['x-auth-token'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};