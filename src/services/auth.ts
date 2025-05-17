import type { User } from "../types"
import { updateUserName, updateUserBalance } from "./userDataService"
import { initializePassword } from "./securityService"

// Simulación de un servicio de autenticación
// En una aplicación real, esto se conectaría a un backend

const mockUser: User = {
  id: "user123",
  name: "Usuario Demo",
  email: "usuario@ejemplo.com",
  balance: "108750",
}

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulación de una llamada a API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          resolve(mockUser)
        } else {
          reject(new Error("Credenciales inválidas"))
        }
      }, 1000)
    })
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    // Simulación de una llamada a API
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        if (name && email && password) {
          // Crear un nuevo usuario con saldo inicial de 0
          const newUser = {
            ...mockUser,
            name,
            email,
            balance: "0", // Saldo inicial en 0 para nuevos usuarios
          }

          try {
            // Actualizar los datos del usuario en el servicio de datos
            await updateUserName(name)
            await updateUserBalance("0") // Establecer saldo inicial en 0

            // Inicializar la contraseña del usuario
            await initializePassword(password)

            resolve(newUser)
          } catch (error) {
            reject(error)
          }
        } else {
          reject(new Error("Datos de registro inválidos"))
        }
      }, 1000)
    })
  },

  logout: async (): Promise<void> => {
    // Simulación de una llamada a API
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          // Importar dinámicamente para evitar la dependencia circular
          const { resetUserData } = await import("./userDataService")
          const { resetSecurityData } = await import("./securityService")

          await resetUserData()
          await resetSecurityData()

          resolve()
        } catch (error) {
          console.error("Error al cerrar sesión:", error)
          resolve() // Resolvemos de todas formas para no bloquear el flujo
        }
      }, 500)
    })
  },

  getCurrentUser: async (): Promise<User | null> => {
    // Simulación de una llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUser)
      }, 500)
    })
  },
}
