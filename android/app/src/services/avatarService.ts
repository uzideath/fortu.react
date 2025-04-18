// Almacenamiento en memoria para el avatar seleccionado
let selectedAvatarId: string | null = "avatar1"

// Interfaz para el avatar
export interface AvatarInfo {
  id: string
  source: any // Tipo 'any' para las imágenes importadas
  name: string
}

// Mapeo estático de todos los avatares disponibles
const avatarMap: Record<string, any> = {
  avatar1: require("../assets/images/avatar1.png"),
  avatar2: require("../assets/images/avatar2.png"),
  avatar3: require("../assets/images/avatar3.png"),
  avatar4: require("../assets/images/avatar4.png"),
  avatar5: require("../assets/images/avatar5.png"),
  avatar6: require("../assets/images/avatar6.png"),
  avatar7: require("../assets/images/avatar7.png"),
  avatar8: require("../assets/images/avatar8.png"),
  avatar9: require("../assets/images/avatar9.png"),
  avatar10: require("../assets/images/avatar10.png"),
  avatar11: require("../assets/images/avatar11.png"),
  avatar12: require("../assets/images/avatar12.png"),
  avatar13: require("../assets/images/avatar13.png"),
  avatar14: require("../assets/images/avatar14.png"),
  avatar15: require("../assets/images/avatar15.png"),
  avatar16: require("../assets/images/avatar16.png"),
  avatar17: require("../assets/images/avatar17.png"),
  avatar18: require("../assets/images/avatar18.png"),
  avatar19: require("../assets/images/avatar19.png"),
  avatar20: require("../assets/images/avatar20.png"),
  avatar21: require("../assets/images/avatar21.png"),
  avatar22: require("../assets/images/avatar22.png"),
  avatar23: require("../assets/images/avatar23.png"),
  avatar24: require("../assets/images/avatar24.png"),
  avatar25: require("../assets/images/avatar25.png"),
  avatar26: require("../assets/images/avatar26.png"),
  avatar27: require("../assets/images/avatar27.png"),
  avatar28: require("../assets/images/avatar28.png"),
  profile: require("../assets/images/profile_placeholder.jpg"),
}

// Función para guardar el avatar seleccionado
export const saveSelectedAvatar = async (avatar: AvatarInfo): Promise<void> => {
  try {
    // Guardamos el ID del avatar en la variable global
    selectedAvatarId = avatar.id
    console.log("Avatar guardado correctamente:", avatar.id)
  } catch (error) {
    console.error("Error al guardar el avatar:", error)
  }
}

// Función para obtener el ID del avatar seleccionado
export const getSelectedAvatarId = async (): Promise<string | null> => {
  return selectedAvatarId
}

// NUEVA FUNCIÓN: Obtener el ID del avatar seleccionado de forma sincrónica
export const getCurrentAvatarId = (): string => {
  return selectedAvatarId || "avatar1"
}

// Función para obtener el avatar por ID
export const getAvatarById = (id: string): AvatarInfo => {
  // Verificar si el avatar existe en nuestro mapeo
  if (avatarMap[id]) {
    return {
      id,
      source: avatarMap[id],
      name: `Avatar ${id.replace("avatar", "")}`,
    }
  } else {
    // Si no existe, devolver el avatar por defecto
    console.warn(`Avatar ${id} no encontrado, usando avatar por defecto`)
    return {
      id: "avatar1",
      source: avatarMap.avatar1,
      name: "Avatar 1",
    }
  }
}

// NUEVA FUNCIÓN: Obtener el avatar actual de forma sincrónica
export const getCurrentAvatar = (): AvatarInfo => {
  const currentId = getCurrentAvatarId()
  return getAvatarById(currentId)
}

// Función para obtener todos los avatares disponibles
export const getAllAvatars = (): AvatarInfo[] => {
  const avatars: AvatarInfo[] = []

  // Convertir el mapeo de avatares en un array de AvatarInfo
  Object.keys(avatarMap).forEach((id) => {
    try {
      avatars.push({
        id,
        source: avatarMap[id],
        name: id === "profile" ? "Foto de perfil" : `Avatar ${id.replace("avatar", "")}`,
      })
    } catch (error) {
      console.warn(`No se pudo cargar ${id}`)
    }
  })

  return avatars
}
