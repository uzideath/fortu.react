// Importar AsyncStorage para persistencia
import AsyncStorage from "@react-native-async-storage/async-storage"

// Implementación simple de EventEmitter para React Native
class AvatarEventEmitter {
  private listeners: Record<string, Function[]> = {}

  on(event: string, listener: Function): void {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(listener)
  }

  off(event: string, listener: Function): void {
    if (!this.listeners[event]) return
    this.listeners[event] = this.listeners[event].filter((l) => l !== listener)
  }

  emit(event: string, ...args: any[]): void {
    if (!this.listeners[event]) return
    this.listeners[event].forEach((listener) => {
      try {
        listener(...args)
      } catch (error) {
        console.error(`Error en listener de evento ${event}:`, error)
      }
    })
  }
}

// Evento para notificar cambios de avatar
export const avatarEvents = new AvatarEventEmitter()
const AVATAR_STORAGE_KEY = "selected_avatar_id"

// Interfaz para la información del avatar
export interface AvatarInfo {
  id: string
  source: any
  name: string
}

// Lista completa de avatares disponibles
const avatarsList: AvatarInfo[] = [
  {
    id: "avatar1",
    source: require("../assets/images/avatar1.png"),
    name: "Avatar 1",
  },
  {
    id: "avatar2",
    source: require("../assets/images/avatar2.png"),
    name: "Avatar 2",
  },
  {
    id: "avatar3",
    source: require("../assets/images/avatar3.png"),
    name: "Avatar 3",
  },
  {
    id: "avatar4",
    source: require("../assets/images/avatar4.png"),
    name: "Avatar 4",
  },
  {
    id: "avatar5",
    source: require("../assets/images/avatar5.png"),
    name: "Avatar 5",
  },
  {
    id: "avatar6",
    source: require("../assets/images/avatar6.png"),
    name: "Avatar 6",
  },
  {
    id: "avatar7",
    source: require("../assets/images/avatar7.png"),
    name: "Avatar 7",
  },
  {
    id: "avatar8",
    source: require("../assets/images/avatar8.png"),
    name: "Avatar 8",
  },
  {
    id: "avatar9",
    source: require("../assets/images/avatar9.png"),
    name: "Avatar 9",
  },
  {
    id: "avatar10",
    source: require("../assets/images/avatar10.png"),
    name: "Avatar 10",
  },
  {
    id: "avatar11",
    source: require("../assets/images/avatar11.png"),
    name: "Avatar 11",
  },
  {
    id: "avatar12",
    source: require("../assets/images/avatar12.png"),
    name: "Avatar 12",
  },
  {
    id: "avatar13",
    source: require("../assets/images/avatar13.png"),
    name: "Avatar 13",
  },
  {
    id: "avatar14",
    source: require("../assets/images/avatar14.png"),
    name: "Avatar 14",
  },
  {
    id: "avatar15",
    source: require("../assets/images/avatar15.png"),
    name: "Avatar 15",
  },
  {
    id: "avatar16",
    source: require("../assets/images/avatar16.png"),
    name: "Avatar 16",
  },
  {
    id: "avatar17",
    source: require("../assets/images/avatar17.png"),
    name: "Avatar 17",
  },
  {
    id: "avatar18",
    source: require("../assets/images/avatar18.png"),
    name: "Avatar 18",
  },
  {
    id: "avatar19",
    source: require("../assets/images/avatar19.png"),
    name: "Avatar 19",
  },
  {
    id: "avatar20",
    source: require("../assets/images/avatar20.png"),
    name: "Avatar 20",
  },
  {
    id: "avatar21",
    source: require("../assets/images/avatar21.png"),
    name: "Avatar 21",
  },
  {
    id: "avatar22",
    source: require("../assets/images/avatar22.png"),
    name: "Avatar 22",
  },
  {
    id: "avatar23",
    source: require("../assets/images/avatar23.png"),
    name: "Avatar 23",
  },
  {
    id: "avatar24",
    source: require("../assets/images/avatar24.png"),
    name: "Avatar 24",
  },
  {
    id: "avatar25",
    source: require("../assets/images/avatar25.png"),
    name: "Avatar 25",
  },
  {
    id: "avatar26",
    source: require("../assets/images/avatar26.png"),
    name: "Avatar 26",
  },
  {
    id: "avatar27",
    source: require("../assets/images/avatar27.png"),
    name: "Avatar 27",
  },
  {
    id: "avatar28",
    source: require("../assets/images/avatar28.png"),
    name: "Avatar 28",
  },
]

// Función para obtener todos los avatares disponibles
export const getAllAvatars = (): AvatarInfo[] => {
  return avatarsList
}

// Función para guardar el avatar seleccionado
export const saveSelectedAvatar = async (avatar: AvatarInfo): Promise<void> => {
  try {
    await AsyncStorage.setItem(AVATAR_STORAGE_KEY, avatar.id)
    // Emitir evento para notificar a todas las pantallas
    avatarEvents.emit("avatarChanged", avatar)
    console.log("Avatar guardado:", avatar.id)
    return Promise.resolve()
  } catch (error) {
    console.error("Error al guardar el avatar:", error)
    return Promise.reject(error)
  }
}

// Función para obtener el avatar seleccionado
export const getSelectedAvatar = async (): Promise<AvatarInfo> => {
  try {
    const avatarId = await AsyncStorage.getItem(AVATAR_STORAGE_KEY)
    if (avatarId) {
      const avatar = avatarsList.find((a) => a.id === avatarId)
      if (avatar) {
        return avatar
      }
    }
    // Si no hay avatar seleccionado o no se encuentra, devolver el primero
    return avatarsList[0]
  } catch (error) {
    console.error("Error al obtener el avatar:", error)
    return avatarsList[0]
  }
}

// Función para obtener el avatar por ID
export const getAvatarById = (id: string): AvatarInfo | undefined => {
  return avatarsList.find((avatar) => avatar.id === id)
}
