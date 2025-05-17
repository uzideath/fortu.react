import { movementsService, movementsEvents, MovementType } from "./movementsService"
import type { Movement } from "../types"
import { EventEmitter } from "./eventEmitter"

// Evento para notificar cambios en las estadísticas
export const statisticsEvents = new EventEmitter()

// Interfaz para los datos de categoría
export interface CategoryData {
  type: string
  title: string
  amount: number
  color: string
  percentage?: number
}

// Interfaz para las estadísticas
export interface Statistics {
  categories: CategoryData[]
  totalAmount: number
  currentMonth: string
}

// Función para extraer el valor numérico de una cadena de monto (ej: "$50.000" -> 50000)
const extractAmountValue = (amountString: string): number => {
  // Eliminar el símbolo de moneda y cualquier separador de miles
  const cleanedAmount = amountString.replace(/[$,.\s]/g, "")
  return Number.parseInt(cleanedAmount, 10) || 0
}

// Función para obtener el nombre del mes actual
const getCurrentMonth = (): string => {
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]
  const currentDate = new Date()
  return months[currentDate.getMonth()]
}

// Servicio de estadísticas
export const statisticsService = {
  // Obtener estadísticas basadas en los movimientos
  getStatistics: async (): Promise<Statistics> => {
    try {
      // Obtener todos los movimientos
      const movements = await movementsService.getMovements()

      // Inicializar categorías con valores en cero
      const categories: CategoryData[] = [
        {
          type: MovementType.LOTTERY,
          title: "Loterías en línea",
          amount: 0,
          color: "#2262CE", // Azul
        },
        {
          type: MovementType.CHANCE,
          title: "Chance en línea",
          amount: 0,
          color: "#59CDF2", // Azul claro
        },
        {
          type: MovementType.GROUP,
          title: "Sorteos grupales",
          amount: 0,
          color: "#FEC937", // Amarillo
        },
        {
          type: MovementType.INTERNATIONAL,
          title: "Lotería Internacional",
          amount: 0,
          color: "#7CDDB3", // Verde
        },
      ]

      // Calcular el monto total por categoría
      movements.forEach((movement: Movement) => {
        const amount = extractAmountValue(movement.amount)
        const categoryIndex = categories.findIndex((cat) => cat.type === movement.type)

        if (categoryIndex !== -1) {
          categories[categoryIndex].amount += amount
        }
      })

      // Calcular el monto total
      const totalAmount = categories.reduce((sum, category) => sum + category.amount, 0)

      // Calcular porcentajes
      if (totalAmount > 0) {
        categories.forEach((category) => {
          category.percentage = (category.amount / totalAmount) * 100
        })
      }

      // Obtener el mes actual
      const currentMonth = getCurrentMonth()

      return {
        categories,
        totalAmount,
        currentMonth,
      }
    } catch (error) {
      console.error("Error al obtener estadísticas:", error)

      // Devolver datos por defecto en caso de error
      return {
        categories: [
          {
            type: MovementType.LOTTERY,
            title: "Loterías en línea",
            amount: 0,
            color: "#2262CE",
            percentage: 25,
          },
          {
            type: MovementType.CHANCE,
            title: "Chance en línea",
            amount: 0,
            color: "#59CDF2",
            percentage: 25,
          },
          {
            type: MovementType.GROUP,
            title: "Sorteos grupales",
            amount: 0,
            color: "#FEC937",
            percentage: 25,
          },
          {
            type: MovementType.INTERNATIONAL,
            title: "Lotería Internacional",
            amount: 0,
            color: "#7CDDB3",
            percentage: 25,
          },
        ],
        totalAmount: 0,
        currentMonth: getCurrentMonth(),
      }
    }
  },

  // Inicializar el servicio y configurar los listeners
  initialize: () => {
    // Escuchar cambios en los movimientos
    movementsEvents.on("movementsChanged", async () => {
      // Cuando los movimientos cambian, recalcular las estadísticas
      const statistics = await statisticsService.getStatistics()

      // Emitir evento con las nuevas estadísticas
      statisticsEvents.emit("statisticsChanged", statistics)
    })

    console.log("Servicio de estadísticas inicializado")
  },
}

// Inicializar el servicio automáticamente
statisticsService.initialize()
