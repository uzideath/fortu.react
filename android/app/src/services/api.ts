import type { Lottery, Group, GameHistory, Ticket, PaymentMethod } from "../types"

// Datos simulados para la aplicación
const mockLotteries: Lottery[] = [
  { id: "baloto", name: "Baloto", icon: "🎮", nextDraw: "2023-04-15", prize: "5000000000", score: 98 },
  { id: "chance", name: "Chance", icon: "🎲", nextDraw: "2023-04-12", prize: "1000000000", score: 85 },
  { id: "loteria", name: "Lotería de Bogotá", icon: "🎯", nextDraw: "2023-04-14", prize: "2000000000", score: 92 },
  { id: "superastro", name: "Super Astro", icon: "🌟", nextDraw: "2023-04-13", prize: "500000000", score: 78 },
]

const mockGroups: Group[] = [
  { id: "1", name: "Grupo 33", members: 120, game: "Baloto", tickets: 829, score: 98 },
  { id: "2", name: "Grupo 15", members: 85, game: "Chance", tickets: 456, score: 85 },
  { id: "3", name: "Grupo 27", members: 210, game: "Lotería de Bogotá", tickets: 1024, score: 92 },
]

const mockGameHistory: GameHistory[] = [
  { id: "1", name: "Baloto", date: "2023-04-01", status: "Ganador", amount: "150000" },
  { id: "2", name: "Chance", date: "2023-03-28", status: "Perdedor", amount: "5000" },
  { id: "3", name: "Lotería de Bogotá", date: "2023-03-25", status: "Pendiente", amount: "10000" },
]

const mockTickets: Ticket[] = [
  {
    id: "1",
    lottery: "Baloto",
    date: "2023-04-01",
    numbers: ["1", "5", "7", "9"],
    amount: "150000",
    status: "Ganador",
  },
  { id: "2", lottery: "Chance", date: "2023-03-28", numbers: ["2", "4", "6", "8"], amount: "5000", status: "Perdedor" },
  {
    id: "3",
    lottery: "Lotería de Bogotá",
    date: "2023-03-25",
    numbers: ["3", "5", "7", "9"],
    amount: "10000",
    status: "Pendiente",
  },
]

// Inicialmente no hay métodos de pago preferidos
const mockPaymentMethods: PaymentMethod[] = []

// API simulada
export const api = {
  getLotteries: async (): Promise<Lottery[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockLotteries)
      }, 500)
    })
  },

  getLotteryById: async (id: string): Promise<Lottery | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockLotteries.find((lottery) => lottery.id === id))
      }, 300)
    })
  },

  getGroups: async (): Promise<Group[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockGroups)
      }, 500)
    })
  },

  getGroupById: async (id: string): Promise<Group | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockGroups.find((group) => group.id === id))
      }, 300)
    })
  },

  getGameHistory: async (): Promise<GameHistory[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockGameHistory)
      }, 500)
    })
  },

  getTickets: async (): Promise<Ticket[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTickets)
      }, 500)
    })
  },

  getTicketById: async (id: string): Promise<Ticket | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTickets.find((ticket) => ticket.id === id))
      }, 300)
    })
  },

  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("API: Enviando métodos de pago:", JSON.stringify(mockPaymentMethods, null, 2))
        resolve([...mockPaymentMethods]) // Enviamos una copia para evitar problemas de referencia
      }, 500)
    })
  },

  // Modificar la función addPaymentMethod para asegurar que el tipo se guarde correctamente
  addPaymentMethod: async (paymentMethod: Omit<PaymentMethod, "id">): Promise<PaymentMethod> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Asegurarse de que el tipo de tarjeta se guarde correctamente
        const newPaymentMethod = {
          id: Math.random().toString(36).substring(2, 9),
          ...paymentMethod,
        }

        // Verificar que el tipo de tarjeta esté presente y sea correcto
        if (newPaymentMethod.type) {
          console.log("API: Tipo de tarjeta antes de guardar:", newPaymentMethod.type)
          // Asegurarse de que el tipo esté en minúsculas y sin espacios
          newPaymentMethod.type = newPaymentMethod.type.toLowerCase().trim()
          console.log("API: Tipo de tarjeta normalizado:", newPaymentMethod.type)
        }

        console.log("API: Agregando método de pago:", JSON.stringify(newPaymentMethod, null, 2))

        // Si este método es el predeterminado, actualizar los métodos existentes
        if (paymentMethod.isDefault) {
          // Marcar todos los métodos existentes como no predeterminados
          mockPaymentMethods.forEach((method) => {
            method.isDefault = false
          })

          // Limpiar el array y agregar el nuevo método como predeterminado
          mockPaymentMethods.length = 0
          mockPaymentMethods.push(newPaymentMethod)
        } else {
          // Agregar el nuevo método al final de la lista
          mockPaymentMethods.push(newPaymentMethod)
        }

        console.log("API: Métodos de pago actualizados:", JSON.stringify(mockPaymentMethods, null, 2))
        resolve({ ...newPaymentMethod }) // Devolvemos una copia para evitar problemas de referencia
      }, 800)
    })
  },

  placeBet: async (lotteryId: string, numbers: string[], amount: string): Promise<Ticket> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lottery = mockLotteries.find((l) => l.id === lotteryId)
        const newTicket: Ticket = {
          id: Math.random().toString(36).substring(2, 9),
          lottery: lottery?.name || "Desconocido",
          date: new Date().toISOString(),
          numbers,
          amount,
          status: "Pendiente",
        }
        resolve(newTicket)
      }, 1000)
    })
  },
}
