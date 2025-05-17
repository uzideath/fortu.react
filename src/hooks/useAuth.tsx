import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginService, logoutService } from '@/services/auth';

type UserPayload = {
  sub: number;
  email: string;
  iat: number;
  exp: number;
};

type AuthContextType = {
  user: UserPayload | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        try {
          const decoded = jwtDecode<UserPayload>(token);
          setUser(decoded);
        } catch (err) {
          console.warn('Token inválido', err);
        }
      }
      setIsLoading(false);
    };
    loadUserFromStorage();
  }, []);

  const login = async (email: string, password: string) => {
    const decoded = await loginService(email, password);
    setUser(decoded);
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
};
