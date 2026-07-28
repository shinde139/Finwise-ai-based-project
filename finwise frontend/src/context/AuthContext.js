// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        // Try to get full user object first
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } else {
          // Reconstruct from individual items
          const token = localStorage.getItem('token');
          const userId = localStorage.getItem('userId');
          const email = localStorage.getItem('email');
          const name = localStorage.getItem('name');
          
          if (token && userId && email && name) {
            const userData = { 
              userId, 
              email, 
              name,
              token 
            };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData) => {
    try {
      // Store individual items
      localStorage.setItem('token', userData.token);
      localStorage.setItem('userId', userData.userId);
      localStorage.setItem('email', userData.email);
      localStorage.setItem('name', userData.name);
      
      // Store full user object
      const userObj = {
        userId: userData.userId,
        email: userData.email,
        name: userData.name,
        token: userData.token
      };
      localStorage.setItem('user', JSON.stringify(userObj));
      
      setUser(userObj);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (newData) => {
    try {
      // Get current user from state or localStorage
      let currentUser = user;
      if (!currentUser) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          currentUser = JSON.parse(storedUser);
        } else {
          currentUser = {};
        }
      }
      
      const updatedUser = { ...currentUser, ...newData };
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update individual items
      if (newData.name) localStorage.setItem('name', newData.name);
      if (newData.email) localStorage.setItem('email', newData.email);
      if (newData.userId) localStorage.setItem('userId', newData.userId);
      if (newData.token) localStorage.setItem('token', newData.token);
      
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Update error:', error);
      return false;
    }
  };

  const getUser = () => {
    return user || JSON.parse(localStorage.getItem('user') || 'null');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      updateUser,
      getUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};