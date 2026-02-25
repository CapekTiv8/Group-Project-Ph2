import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);

        setUser({
          id: decoded.id,
          username: decoded.username,
          token,
        });
      } catch (err) {
        console.log('Invalid token');
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, []);

  function login(token) {
    try {
      const decoded = jwtDecode(token);

      localStorage.setItem('token', token);

      setUser({
        id: decoded.id,
        username: decoded.username,
        token,
      });
    } catch (err) {
      console.log('Login failed: invalid token');
    }
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
