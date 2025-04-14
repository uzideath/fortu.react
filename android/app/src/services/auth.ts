import { User } from '../../src/types';

// Simulación de un servicio de autenticación
// En una aplicación real, esto se conectaría a un backend

const mockUser: User = {
  id: 'user123',
  name: 'Usuario Demo',
  email: 'usuario@ejemplo.com',
  balance: '108750',
};

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulación de una llamada a API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          resolve(mockUser);
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      }, 1000);
    });
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    // Simulación de una llamada a API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (name && email && password) {
          resolve({
            ...mockUser,
            name,
            email,
          });
        } else {
          reject(new Error('Datos de registro inválidos'));
        }
      }, 1000);
    });
  },

  logout: async (): Promise<void> => {
    // Simulación de una llamada a API
    return new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  },

  getCurrentUser: async (): Promise<User | null> => {
    // Simulación de una llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUser);
      }, 500);
    });
  },
};
