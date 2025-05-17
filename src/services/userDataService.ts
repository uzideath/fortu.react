import AsyncStorage from "@react-native-async-storage/async-storage"
import { EventEmitter } from "./eventEmitter"

// Evento para notificar cambios en los datos del usuario
export const userDataEvents = new EventEmitter()

// Claves para almacenamiento local
const USER_BALANCE_KEY = "user_balance"
const USER_NAME_KEY = "user_name"
const USER_REGISTERED_KEY = "user_registered" // Nueva clave para saber si es un usuario registrado

// Datos iniciales del usuario (simulando datos del backend)
const initialUserData = {
  balance: "0", // Cambiado a 0 para nuevos usuarios
  name: "Usuario Demo",
}

// Interfaz para los datos del usuario
export interface UserData {
  balance: string
  name: string
}

// Función para obtener los datos del usuario
export const getUserData = async (): Promise<UserData> => {
  try {
    // Verificar si el usuario ya se ha registrado
    const isRegistered = await AsyncStorage.getItem(USER_REGISTERED_KEY)

    // Intentar obtener datos del almacenamiento local
    const storedBalance = await AsyncStorage.getItem(USER_BALANCE_KEY)
    const storedName = await AsyncStorage.getItem(USER_NAME_KEY)

    // Si hay datos almacenados, usarlos
    if (storedBalance && storedName) {
      return {
        balance: storedBalance,
        name: storedName,
      }
    }

    // Si no hay datos almacenados, usar los datos iniciales y guardarlos
    await AsyncStorage.setItem(USER_BALANCE_KEY, initialUserData.balance)
    await AsyncStorage.setItem(USER_NAME_KEY, initialUserData.name)

    // Si es la primera vez que se usa la app, marcar como no registrado
    if (!isRegistered) {
      await AsyncStorage.setItem(USER_REGISTERED_KEY, "false")
    }

    return initialUserData
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error)
    // En caso de error, devolver los datos iniciales
    return initialUserData
  }
}

// Función para actualizar el saldo del usuario
export const updateUserBalance = async (newBalance: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_BALANCE_KEY, newBalance)

    // Obtener el nombre actual para mantener la consistencia
    const name = (await AsyncStorage.getItem(USER_NAME_KEY)) || initialUserData.name

    // Emitir evento para notificar a todas las pantallas
    userDataEvents.emit("userDataChanged", { balance: newBalance, name })

    console.log("Saldo actualizado:", newBalance)
  } catch (error) {
    console.error("Error al actualizar el saldo:", error)
    throw error
  }
}

// Función para actualizar el nombre del usuario
export const updateUserName = async (newName: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_NAME_KEY, newName)

    // Marcar al usuario como registrado
    await AsyncStorage.setItem(USER_REGISTERED_KEY, "true")

    // Obtener el saldo actual para mantener la consistencia
    const balance = (await AsyncStorage.getItem(USER_BALANCE_KEY)) || initialUserData.balance

    // Emitir evento para notificar a todas las pantallas
    userDataEvents.emit("userDataChanged", { balance, name: newName })

    console.log("Nombre actualizado:", newName)
  } catch (error) {
    console.error("Error al actualizar el nombre:", error)
    throw error
  }
}

// Función para simular una transacción (agregar o restar saldo)
export const simulateTransaction = async (amount: number): Promise<string> => {
  try {
    // Obtener el saldo actual
    const currentBalance = (await AsyncStorage.getItem(USER_BALANCE_KEY)) || initialUserData.balance

    // Calcular el nuevo saldo
    const newBalance = (Number.parseInt(currentBalance) + amount).toString()

    // Actualizar el saldo
    await updateUserBalance(newBalance)

    return newBalance
  } catch (error) {
    console.error("Error en la transacción:", error)
    throw error
  }
}

// Función para verificar si el usuario está registrado
export const isUserRegistered = async (): Promise<boolean> => {
  try {
    const registered = await AsyncStorage.getItem(USER_REGISTERED_KEY)
    return registered === "true"
  } catch (error) {
    console.error("Error al verificar registro:", error)
    return false
  }
}

// Función para resetear los datos del usuario (útil para cerrar sesión)
export const resetUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_BALANCE_KEY)
    await AsyncStorage.removeItem(USER_NAME_KEY)
    await AsyncStorage.setItem(USER_REGISTERED_KEY, "false")

    // Emitir evento con los valores iniciales
    userDataEvents.emit("userDataChanged", initialUserData)

    console.log("Datos de usuario reseteados")
  } catch (error) {
    console.error("Error al resetear datos:", error)
    throw error
  }
}
