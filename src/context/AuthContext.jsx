import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('vehicle_reg_auth');
    if (saved === 'true') {
      setIsAuthenticated(true);
      setUser({ email: 'test@gmail.com' });
    }
  }, []);

  const login = ({ email, password }) => {
    if (email === 'test@gmail.com' && password === 'Password!234') {
      localStorage.setItem('vehicle_reg_auth', 'true');
      setIsAuthenticated(true);
      setUser({ email });
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    localStorage.removeItem('vehicle_reg_auth');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
