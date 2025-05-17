import AsyncStorage from "@react-native-async-storage/async-storage"
import { EventEmitter } from "./eventEmitter"

// Evento para notificar cambios en la seguridad
export const securityEvents = new EventEmitter()

// Claves para almacenamiento local
const USER_PASSWORD_KEY = "user_password"
const DEFAULT_PASSWORD = "Password123!" // Contraseña por defecto para pruebas

// Función para verificar la contraseña actual
export const verifyCurrentPassword = async (password: string): Promise<boolean> => {
  try {
    // Obtener la contraseña almacenada
    const storedPassword = (await AsyncStorage.getItem(USER_PASSWORD_KEY)) || DEFAULT_PASSWORD

    // Verificar si la contraseña proporcionada coincide con la almacenada
    return password === storedPassword
  } catch (error) {
    console.error("Error al verificar la contraseña:", error)
    return false
  }
}

// Función para actualizar la contraseña
export const updatePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    // Verificar la contraseña actual
    const isPasswordValid = await verifyCurrentPassword(currentPassword)

    if (!isPasswordValid) {
      return {
        success: false,
        message: "La contraseña actual es incorrecta",
      }
    }

    // Guardar la nueva contraseña
    await AsyncStorage.setItem(USER_PASSWORD_KEY, newPassword)

    // Emitir evento de cambio de contraseña
    securityEvents.emit("passwordChanged", { timestamp: new Date().toISOString() })

    console.log("Contraseña actualizada correctamente")

    return {
      success: true,
      message: "Contraseña actualizada correctamente",
    }
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error)
    return {
      success: false,
      message: "Error al actualizar la contraseña. Intenta nuevamente.",
    }
  }
}

// Función para inicializar la contraseña (útil para registro de usuario)
export const initializePassword = async (password: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_PASSWORD_KEY, password)
    console.log("Contraseña inicializada correctamente")
  } catch (error) {
    console.error("Error al inicializar la contraseña:", error)
    throw error
  }
}

// Función para resetear los datos de seguridad (útil para cerrar sesión)
export const resetSecurityData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_PASSWORD_KEY)
    console.log("Datos de seguridad reseteados")
  } catch (error) {
    console.error("Error al resetear datos de seguridad:", error)
    throw error
  }
}

// Función para obtener la contraseña actual (solo para propósitos de desarrollo)
export const getCurrentPassword = async (): Promise<string> => {
  try {
    return (await AsyncStorage.getItem(USER_PASSWORD_KEY)) || DEFAULT_PASSWORD
  } catch (error) {
    console.error("Error al obtener la contraseña actual:", error)
    return DEFAULT_PASSWORD
  }
}
