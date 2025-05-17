"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  ImageBackground,
  StatusBar,
  Platform,
  Dimensions,
  NativeModules,
  Alert,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import type { MainScreenProps, Movement } from "src/types"
import { useFocusEffect } from "@react-navigation/native"
import { getSelectedAvatar } from "src/services/avatarService"
import { movementsService, movementsEvents, getImageFromSource } from "src/services/movementsService"
// Añadir la importación del servicio userDataService y sus eventos
import { getUserData, userDataEvents, type UserData } from "src/services/userDataService"
import { formatCurrency } from "src/utils/helpers"

// Obtener dimensiones de la pantalla
const { width, height } = Dimensions.get("window")
const { StatusBarManager } = NativeModules
const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBarManager.HEIGHT

const MovementsDetailScreen: React.FC<MainScreenProps<"Movements">> = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const [searchText, setSearchText] = useState("")
  const [movements, setMovements] = useState<Movement[]>([])
  const [avatarSource, setAvatarSource] = useState<any>(null)
  const [statusBarHeight, setStatusBarHeight] = useState(STATUSBAR_HEIGHT)
  // Añadir un estado para el saldo dentro de la función del componente, justo después de los otros estados
  const [balance, setBalance] = useState<string>("0")

  // Función para cargar los movimientos
  const loadMovements = useCallback(async () => {
    try {
      const data = await movementsService.getMovements()
      setMovements(data)
    } catch (error) {
      console.error("Error al cargar movimientos:", error)
    }
  }, [])

  // Detectar si el dispositivo tiene notch o isla dinámica
  useEffect(() => {
    if (Platform.OS === "ios") {
      // Obtener la altura exacta de la barra de estado
      StatusBarManager.getHeight((statusBarFrameData: { height: number }) => {
        setStatusBarHeight(statusBarFrameData.height)
      })
    }
  }, [])

  // Función para actualizar el avatar
  const updateAvatar = useCallback(async () => {
    try {
      const currentAvatar = await getSelectedAvatar()
      if (currentAvatar) {
        setAvatarSource(currentAvatar.source)
      }
    } catch (error) {
      console.error("Error updating avatar:", error)
      // Usar una imagen predeterminada en caso de error
      setAvatarSource(require("src/assets/images/profile_placeholder.jpg"))
    }
  }, [])

  // Añadir una función para actualizar los datos del usuario después de la función updateAvatar
  const updateUserData = useCallback(async () => {
    try {
      const userData = await getUserData()
      setBalance(userData.balance)
    } catch (error) {
      console.error("Error updating user data:", error)
    }
  }, [])

  // Actualizar el avatar cuando la pantalla obtiene el foco
  useFocusEffect(
    useCallback(() => {
      updateAvatar()
      updateUserData() // Añadir esta línea
      return () => {
        // Cleanup opcional
      }
    }, [updateAvatar, updateUserData]), // Añadir updateUserData a las dependencias
  )

  // Cargar avatar al montar el componente
  useEffect(() => {
    updateAvatar()
    updateUserData() // Añadir esta línea
  }, [updateAvatar, updateUserData]) // Añadir updateUserData a las dependencias

  // Cargar movimientos y suscribirse a cambios
  useEffect(() => {
    loadMovements()

    // Suscribirse a cambios en los movimientos
    const handleMovementsChanged = (updatedMovements: Movement[]) => {
      setMovements(updatedMovements)
    }

    movementsEvents.on("movementsChanged", handleMovementsChanged)

    // Limpiar suscripción al desmontar
    return () => {
      movementsEvents.off("movementsChanged", handleMovementsChanged)
    }
  }, [loadMovements])

  // Añadir un useEffect para escuchar cambios en los datos del usuario después del useEffect para el avatar
  useEffect(() => {
    // Suscribirse al evento de cambio de datos del usuario
    const handleUserDataChange = (userData: UserData) => {
      setBalance(userData.balance)
    }

    userDataEvents.on("userDataChanged", handleUserDataChange)

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      userDataEvents.off("userDataChanged", handleUserDataChange)
    }
  }, [])

  // Filtrar movimientos basados en el texto de búsqueda
  useEffect(() => {
    if (searchText.trim() === "") {
      loadMovements() // Recargar todos los movimientos
    } else {
      const filtered = movements.filter(
        (movement) =>
          movement.title.toLowerCase().includes(searchText.toLowerCase()) ||
          movement.date.includes(searchText) ||
          movement.amount.includes(searchText),
      )
      setMovements(filtered)
    }
  }, [searchText, loadMovements])

  // Actualizar la función renderMovementItem para usar los colores específicos
  const renderMovementItem = ({ item }: { item: Movement }) => {
    // Determinar el color de la barra lateral según el tipo de movimiento
    let barColor = "#FEC937" // Amarillo por defecto para Sorteos grupales
    if (item.type === "chance") barColor = "#59CDF2" // Azul claro para Chance en línea
    if (item.type === "lottery") barColor = "#2262CE" // Azul para Lotería en línea
    if (item.type === "international") barColor = "#7CDDB3" // Verde para Loterías Internacionales

    // Obtener la imagen del logo basada en la fuente
    const logoImage = item.logoSource ? getImageFromSource(item.logoSource) : null

    return (
      <View style={styles.movementCardContainer}>
        <TouchableOpacity
          style={styles.movementCard}
          onPress={() => {
            // Aquí se puede navegar a los detalles del movimiento
            console.log(`Ver detalles del movimiento ${item.id}`)
          }}
        >
          <View style={[styles.movementBar, { backgroundColor: barColor }]} />
          <View style={styles.movementContent}>
            <View style={styles.movementTopSection}>
              <Text style={styles.movementTitle}>{item.title}</Text>
              <Text style={styles.movementDate}>{item.date}</Text>
            </View>

            <View style={styles.movementBottomSection}>
              <Text style={styles.movementAmount}>{item.amount}</Text>
              <View style={styles.logoContainer}>
                {logoImage ? (
                  <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />
                ) : (
                  <Text style={styles.groupText}>Grupo {item.groupId}</Text>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  // Renderizar el footer con el botón "Ver más movimientos"
  const renderFooter = () => {
    return (
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.viewMoreButton} onPress={() => navigation.navigate("Statistics")}>
          <Text style={styles.viewMoreText}>Ver más movimientos</Text>
        </TouchableOpacity>

        {/* Botón para añadir movimiento aleatorio (solo para pruebas) */}
        <TouchableOpacity
          style={styles.testButton}
          onPress={async () => {
            await movementsService.addRandomMovements()
            Alert.alert("Movimiento añadido", "Se ha añadido un movimiento aleatorio para pruebas")
          }}
        >
          <Text style={styles.testButtonText}>+ Añadir movimiento (prueba)</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ImageBackground
      source={require("src/assets/images/Fondo7_FORTU.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="#2262CE" />
      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* Header con botones de navegación */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image source={require("src/assets/images/back_button.png")} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Image source={require("src/assets/images/campana.png")} style={styles.headerIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        {/* Sección de perfil y saldo */}
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.profileImageContainer}>
            <Image
              source={avatarSource || require("src/assets/images/profile_placeholder.jpg")}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.balanceLabel}>Saldo</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
          </View>
        </View>

        {/* Título de la sección */}
        <Text style={styles.sectionTitle}>Mis movimientos</Text>

        {/* Barra de búsqueda */}
        <View style={styles.searchContainer}>
          <Image source={require("src/assets/images/search_icon.png")} style={styles.searchIcon} resizeMode="contain" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Lista de movimientos */}
        <FlatList
          data={movements}
          renderItem={renderMovementItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.movementsList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
        />
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 10 : 40,
    marginBottom: 20,
  },
  iconButton: {
    marginRight: 20,
    padding: 5,
  },
  headerIcon: {
    width: 28,
    height: 28,
  },
  backIcon: {
    width: 40,
    height: 40,
  },
  profileSection: {
    alignItems: "flex-end",
    marginBottom: 30,
    position: "absolute",
    right: 24,
    top: Platform.OS === "ios" ? 60 : 90,
  },
  profileImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  profileInfo: {
    alignItems: "flex-end",
  },
  balanceLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 5,
    textAlign: "right",
  },
  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "right",
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 100,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 50,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: "#FFFFFF",
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: "#FFFFFF",
    fontSize: 16,
  },
  movementsList: {
    paddingBottom: 20,
  },
  movementCardContainer: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  movementCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    overflow: "hidden",
    height: 120,
  },
  movementBar: {
    width: 10,
  },
  movementContent: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  movementTopSection: {
    marginBottom: 10,
  },
  movementBottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  movementTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 6,
  },
  movementDate: {
    fontSize: 15,
    color: "#666666",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  logoImage: {
    width: 85,
    height: 45,
  },
  movementAmount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "left",
  },
  groupText: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#2262CE",
  },
  footerContainer: {
    alignItems: "center",
    paddingVertical: 20,
    marginTop: 10,
  },
  viewMoreButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  viewMoreText: {
    color: "#2262CE",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  testButton: {
    backgroundColor: "#59CDF2",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default MovementsDetailScreen
