import api from '@/lib/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

type UserPayload = {
  sub: string;
  email: string;
  iat: number;
  exp: number;
};

export const loginService = async (email: string, password: string): Promise<UserPayload> => {
  const res = await api.post('/auth/login', { email, password });
  const { accessToken, refreshToken } = res.data.data;

  await AsyncStorage.setItem('accessToken', accessToken);
  await AsyncStorage.setItem('refreshToken', refreshToken);

  return jwtDecode<UserPayload>(accessToken);
};

export const logoutService = async (): Promise<void> => {
  await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
};
