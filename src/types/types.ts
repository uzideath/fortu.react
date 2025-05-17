import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "."

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, "Register">

export interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp
}

export interface PasswordRequirement {
  label: string
  isValid: boolean
  regex: RegExp
}

export interface LocationItem {
  label: string
  value: string
  normalizedLabel?: string // Añadimos esta propiedad para pre-normalizar
}
