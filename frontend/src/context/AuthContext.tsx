import { createContext } from 'react';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>(null!);
