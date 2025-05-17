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
import { resetTo } from '@/lib/navigation';

type UserPayload = {
  sub: string;
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
          const isExpired = decoded.exp * 1000 < Date.now();

          if (isExpired) {
            await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
            resetTo('Login');
          } else {
            setUser(decoded);
          }
        } catch (err) {
          console.warn('Token inválido', err);
          await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
          resetTo('Login');
        }
      } else {
        resetTo('Login');
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
    await logoutService(); // solo borra tokens
    setUser(null);
    resetTo('Login');
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
