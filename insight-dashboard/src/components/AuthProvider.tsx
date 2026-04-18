import React, { createContext, useContext, useState } from 'react';

// Dummy user object that mimics Firebase User shape
const DUMMY_USER = {
  uid: 'demo-user-001',
  displayName: 'Demo Admin',
  email: 'admin@devops-demo.com',
  photoURL: null,
};

interface AuthContextType {
  user: typeof DUMMY_USER | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<typeof DUMMY_USER | null>(null);
  const [loading] = useState(false);

  const loginWithGoogle = async () => {
    // Simulate a short login delay
    await new Promise(res => setTimeout(res, 500));
    setUser(DUMMY_USER);
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
