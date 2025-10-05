import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token and user data in localStorage
    const savedToken = localStorage.getItem('github_token');
    const savedUser = localStorage.getItem('github_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    // Check URL parameters for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    const urlUser = urlParams.get('user');

    if (urlToken && urlUser) {
      const userData = JSON.parse(decodeURIComponent(urlUser));
      setToken(urlToken);
      setUser(userData);
      
      // Save to localStorage
      localStorage.setItem('github_token', urlToken);
      localStorage.setItem('github_user', JSON.stringify(userData));
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    setLoading(false);
  }, []);

  const login = () => {
    // Redirect to GitHub OAuth
    window.location.href = `https://open-cookie.onrender.com/auth/github`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_user');
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
