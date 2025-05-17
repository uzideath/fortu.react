import type { Movement, ImageSource } from "../types"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { EventEmitter } from "./eventEmitter"

// Evento para notificar cambios en los movimientos
export const movementsEvents = new EventEmitter()

// Clave para almacenar los movimientos
const MOVEMENTS_STORAGE_KEY = "user_movements"

// Tipos de movimientos
export enum MovementType {
  GROUP = "group",
  CHANCE = "chance",
  LOTTERY = "lottery",
  INTERNATIONAL = "international",
}

// Añadir los colores específicos para cada tipo de movimiento
export const MOVEMENT_COLORS = {
  group: "#FEC937", // Amarillo para Sorteos grupales
  chance: "#59CDF2", // Azul claro para Chance en línea
  lottery: "#2262CE", // Azul para Lotería en línea
  international: "#7CDDB3", // Verde para Loterías Internacionales
}

// Corregir el mapeo de fuentes de imágenes
export const IMAGE_SOURCES = {
  Baloto2012: "Baloto2012",
  loteria_medellin: "loteria_medellin",
  loteria_huila: "loteria_huila",
}

// Corregir la función getImageFromSource
export const getImageFromSource = (source: ImageSource | undefined) => {
  if (!source) return null

  switch (source) {
    case "Baloto2012":
      return require("../assets/images/Baloto2012.png")
    case "loteria_medellin":
      return require("../assets/images/loteria_medellin.png")
    case "loteria_huila":
      return require("../assets/images/loteria_huila.png")
    default:
      return null
  }
}

// Datos iniciales de ejemplo (los mismos que estaban en MovementsDetailScreen)
const initialMovements: Movement[] = [
  {
    id: "1",
    type: MovementType.GROUP,
    title: "Sorteos grupales",
    date: "07 / 04 / 2025",
    amount: "$50.000",
    groupId: "33",
  },
  {
    id: "2",
    type: MovementType.CHANCE,
    title: "Chance en línea",
    date: "07 / 05 / 2025",
    amount: "$52.000",
    logoSource: "Baloto2012",
  },
  {
    id: "3",
    type: MovementType.LOTTERY,
    title: "Lotería en línea",
    date: "21 / 05 / 2025",
    amount: "$23.000",
    logoSource: "loteria_medellin",
  },
  {
    id: "4",
    type: MovementType.INTERNATIONAL,
    title: "Lotería Internacional",
    date: "03 / 06 / 2025",
    amount: "$14.000",
    logoSource: "loteria_huila",
  },
]

export const movementsService = {
  // Obtener todos los movimientos
  getMovements: async (): Promise<Movement[]> => {
    try {
      const storedMovements = await AsyncStorage.getItem(MOVEMENTS_STORAGE_KEY)
      if (storedMovements) {
        return JSON.parse(storedMovements)
      }

      // Si no hay datos almacenados, guardar los iniciales
      await AsyncStorage.setItem(MOVEMENTS_STORAGE_KEY, JSON.stringify(initialMovements))
      return initialMovements
    } catch (error) {
      console.error("Error al obtener movimientos:", error)
      return initialMovements
    }
  },

  // Añadir un movimiento de sorteo grupal
  addGroupMovement: async (amount: string, groupId: string): Promise<boolean> => {
    try {
      const movement: Movement = {
        id: Date.now().toString(),
        type: MovementType.GROUP,
        title: "Sorteos grupales",
        date: new Date()
          .toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
          .replace(/\//g, " / "),
        amount: `$${amount}`,
        groupId: groupId,
      }

      return await movementsService.addMovement(movement)
    } catch (error) {
      console.error("Error al añadir movimiento de grupo:", error)
      return false
    }
  },

  // Añadir un movimiento de chance
  addChanceMovement: async (amount: string, logoSource: ImageSource): Promise<boolean> => {
    try {
      const movement: Movement = {
        id: Date.now().toString(),
        type: MovementType.CHANCE,
        title: "Chance en línea",
        date: new Date()
          .toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
          .replace(/\//g, " / "),
        amount: `$${amount}`,
        logoSource: logoSource,
      }

      return await movementsService.addMovement(movement)
    } catch (error) {
      console.error("Error al añadir movimiento de chance:", error)
      return false
    }
  },

  // Añadir un movimiento de lotería
  addLotteryMovement: async (amount: string, logoSource: ImageSource): Promise<boolean> => {
    try {
      const movement: Movement = {
        id: Date.now().toString(),
        type: MovementType.LOTTERY,
        title: "Lotería en línea",
        date: new Date()
          .toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
          .replace(/\//g, " / "),
        amount: `$${amount}`,
        logoSource: logoSource,
      }

      return await movementsService.addMovement(movement)
    } catch (error) {
      console.error("Error al añadir movimiento de lotería:", error)
      return false
    }
  },

  // Añadir un movimiento de lotería internacional
  addInternationalMovement: async (amount: string, logoSource: ImageSource): Promise<boolean> => {
    try {
      const movement: Movement = {
        id: Date.now().toString(),
        type: MovementType.INTERNATIONAL,
        title: "Lotería Internacional",
        date: new Date()
          .toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
          .replace(/\//g, " / "),
        amount: `$${amount}`,
        logoSource: logoSource,
      }

      return await movementsService.addMovement(movement)
    } catch (error) {
      console.error("Error al añadir movimiento internacional:", error)
      return false
    }
  },

  // Método genérico para añadir un movimiento (usado por los métodos específicos)
  addMovement: async (movement: Movement): Promise<boolean> => {
    try {
      // Obtener movimientos actuales
      const currentMovements = await movementsService.getMovements()

      // Añadir el nuevo movimiento al principio
      const updatedMovements = [movement, ...currentMovements]

      // Guardar los movimientos actualizados
      await AsyncStorage.setItem(MOVEMENTS_STORAGE_KEY, JSON.stringify(updatedMovements))

      // Emitir evento de cambio
      movementsEvents.emit("movementsChanged", updatedMovements)

      return true
    } catch (error) {
      console.error("Error al añadir movimiento:", error)
      return false
    }
  },

  // Limpiar todos los movimientos (útil para pruebas)
  clearMovements: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(MOVEMENTS_STORAGE_KEY)
      movementsEvents.emit("movementsChanged", [])
    } catch (error) {
      console.error("Error al limpiar movimientos:", error)
    }
  },

  // Corregir el método addRandomMovements para usar los nombres correctos
  // Método para simular la adición de movimientos aleatorios (para pruebas)
  addRandomMovements: async (): Promise<void> => {
    try {
      // Generar un tipo aleatorio
      const types = [MovementType.GROUP, MovementType.CHANCE, MovementType.LOTTERY, MovementType.INTERNATIONAL]
      const randomType = types[Math.floor(Math.random() * types.length)]

      // Generar un monto aleatorio entre 10,000 y 100,000
      const randomAmount = Math.floor(Math.random() * 90000) + 10000

      // Añadir el movimiento según el tipo
      switch (randomType) {
        case MovementType.GROUP:
          await movementsService.addGroupMovement(randomAmount.toString(), Math.floor(Math.random() * 100).toString())
          break
        case MovementType.CHANCE:
          await movementsService.addChanceMovement(randomAmount.toString(), "Baloto2012")
          break
        case MovementType.LOTTERY:
          await movementsService.addLotteryMovement(randomAmount.toString(), "loteria_medellin")
          break
        case MovementType.INTERNATIONAL:
          await movementsService.addInternationalMovement(randomAmount.toString(), "loteria_huila")
          break
      }

      console.log(`Movimiento aleatorio añadido: ${randomType} por $${randomAmount}`)
    } catch (error) {
      console.error("Error al añadir movimiento aleatorio:", error)
    }
  },
}
