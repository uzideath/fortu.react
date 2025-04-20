// Tipos para los datos de la aplicación

export interface PaymentMethod {
  id: string
  name: string
  icon: string
  isDefault?: boolean
  type?: string
  number?: string
  firstDigits?: string // Añadido para guardar los primeros dígitos
}

export interface LotteryDetail {
  id: string
  chance: string
  lot: string
  location: string
  number: string
}

export interface Lottery {
  id: string
  name: string
  icon: string
  nextDraw: string
  prize: string
  score: number
}

export interface Group {
  id: string
  name: string
  members: number
  game: string
  tickets: number
  score: number
}

export interface GameHistory {
  id: string
  name: string
  date: string
  status: "Ganador" | "Pendiente" | "Perdedor"
  amount: string
}

export interface GroupMember {
  id: string
  avatar: string
  userId: string
  tickets: number
  participation: string
}

export interface User {
  id: string
  name: string
  email: string
  balance: string
}

export interface Ticket {
  id: string
  lottery: string
  date: string
  numbers: string[]
  amount: string
  status: "Ganador" | "Pendiente" | "Perdedor"
}

// Tipos para la navegación
export type RootStackParamList = {
  Splash: undefined
  Login: undefined
  Register: undefined
  Welcome: undefined
  MainApp: undefined
}

// Asegúrate de que MainStackParamList incluya Security y UserInfo
export type MainStackParamList = {
  Home: undefined
  Menu: undefined
  AddPaymentMethod: undefined
  PaymentSection: undefined
  Settings: undefined
  UserInfo: undefined
  Security: undefined
  Games: { screen?: string; params?: any }
}

export type GamesStackParamList = {
  GamesHome: undefined
  LotteriesList: undefined
  BetValue: undefined
  GroupDraw: undefined
  GroupDetail: { lotteryId?: string }
  BetSuccess: undefined
  TicketDetails: { ticketId?: string } | undefined
}
