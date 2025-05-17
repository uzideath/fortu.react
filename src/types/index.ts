// Definiciones de tipos para la navegación y modelos de datos

export type RootStackParamList = {
  Splash: undefined
  Login: undefined
  Register: undefined
  ForgotPassword: undefined
  Welcome: undefined
  MainApp: undefined
}

export type MainStackParamList = {
  Home: undefined
  Menu: undefined
  AddPaymentMethod: undefined
  LoadPaymentMethod: undefined
  Movements: undefined
  Settings: undefined
  Games: undefined
  Profile: undefined // Añadido para futura implementación
  UserInfo: undefined // Añadido para la pantalla de información del usuario
  Security: undefined // Añadido para la pantalla de seguridad
  Privacy: undefined // Añadido para la pantalla de privacidad
  Notifications: undefined // Añadido para la pantalla de notificaciones
  Statistics: undefined
}

export type GamesStackParamList = {
  GamesHome: undefined
  GamesList: undefined
  GameDetail: { gameId: string }
  PlayGame: { gameId: string }
  LotteriesList: undefined
  BetValue: undefined
  GroupDraw: undefined
  GroupDetail: { groupId: string }
  BetSuccess: undefined
  TicketDetails: { ticketId: string }
}

// Modelos de datos

export interface User {
  id: string
  name: string
  email: string
  balance: string
  phone?: string
  address?: string
  birthDate?: string
  documentId?: string
  city?: string
  department?: string
}

export interface PaymentMethod {
  id: string
  type?: string // visa, mastercard, amex, payu, nequi, etc.
  number?: string // Últimos 4 dígitos para tarjetas
  isDefault: boolean
  expiryDate?: string
  cardholderName?: string
  name?: string // Nombre descriptivo del método de pago
  icon?: string
  firstDigits?: string // Primeros dígitos para identificación de tarjeta
}

// Añadir un nuevo tipo para manejar las referencias a imágenes
export type ImageSource = string

// Modificar la interfaz Movement para usar el nuevo tipo
export interface Movement {
  id: string
  type: string // deposit, withdrawal, bet, win, etc.
  title: string
  date: string
  amount: string
  groupId?: string
  paymentMethodId?: string
  status?: string // pending, completed, failed, etc.
  logoSource?: ImageSource // Cambiado de logo a logoSource
}

export interface Lottery {
  id: string
  name: string
  icon: string
  nextDraw: string
  prize: string
  score: number
  ticketPrice?: string
  description?: string
}

export interface Group {
  id: string
  name: string
  members: number
  game: string
  tickets: number
  score: number
  createdAt?: string
  totalAmount?: string
}

export interface GameHistory {
  id: string
  name: string
  date: string
  status: string
  amount: string
  gameType?: string
}

export interface Ticket {
  id: string
  lottery: string
  date: string
  numbers: string[]
  amount: string
  status: string
  purchaseDate?: string
  drawDate?: string
}

// Tipos para props de navegación

export type MainScreenProps<T extends keyof MainStackParamList> = {
  navigation: any
  route: any
}

export type GamesScreenProps<T extends keyof GamesStackParamList> = {
  navigation: any
  route: any
}

// Tipos adicionales para métodos de pago

export type CardType = "visa" | "mastercard" | "amex" | "discover" | "unknown"

export type PaymentMethodType = "card" | "payu" | "nequi" | "bank_transfer" | "cash"

// Tipos para respuestas de API

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Tipos para configuración

export interface AppConfig {
  apiUrl: string
  appVersion: string
  environment: "development" | "production" | "staging"
}
