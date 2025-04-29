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
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import type { MainScreenProps, Movement } from "../../types"
import { useFocusEffect } from "@react-navigation/native"
import { getCurrentAvatar } from "../../services/avatarService"

// Datos de ejemplo para los movimientos
const MOCK_MOVEMENTS: Movement[] = [
  {
    id: "1",
    type: "group",
    title: "Sorteos grupales",
    date: "07 / 04 / 2025",
    amount: "$50.000",
    groupId: "33",
  },
  {
    id: "2",
    type: "chance",
    title: "Chance en línea",
    date: "07 / 05 / 2025",
    amount: "$52.000",
    logo: require("../../assets/images/Baloto2012.png"),
  },
  {
    id: "3",
    type: "lottery",
    title: "Lotería en línea",
    date: "21 / 05 / 2025",
    amount: "$23.000",
    logo: require("../../assets/images/loteria_medellin.png"),
  },
  {
    id: "4",
    type: "international",
    title: "Lotería Internacional",
    date: "03 / 06 / 2025",
    amount: "$14.000",
    logo: require("../../assets/images/loteria_huila.png"),
  },
]

const { StatusBarManager } = NativeModules
const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBarManager.HEIGHT

const MovementsScreen: React.FC<MainScreenProps<"Movements">> = ({ navigation }) => {
  const [searchText, setSearchText] = useState("")
  const [movements, setMovements] = useState<Movement[]>(MOCK_MOVEMENTS)
  const [avatarSource, setAvatarSource] = useState<any>(getCurrentAvatar().source)
  const [statusBarHeight, setStatusBarHeight] = useState(STATUSBAR_HEIGHT)
  const [hasNotchOrIsland, setHasNotchOrIsland] = useState(false)

  // Detectar si el dispositivo tiene notch o isla dinámica
  useEffect(() => {
    if (Platform.OS === "ios") {
      // Verificar si es un iPhone X o posterior (con notch o isla dinámica)
      const { height, width } = Dimensions.get("window")
      const aspectRatio = height / width
      const isIphoneWithNotch = aspectRatio > 2.0
      setHasNotchOrIsland(isIphoneWithNotch)

      // Obtener la altura exacta de la barra de estado
      StatusBarManager.getHeight((statusBarFrameData: { height: number }) => {
        setStatusBarHeight(statusBarFrameData.height)
      })
    }
  }, [])

  // Función para actualizar el avatar (sincrónica)
  const updateAvatar = useCallback(() => {
    const currentAvatar = getCurrentAvatar()
    setAvatarSource(currentAvatar.source)
  }, [])

  // Actualizar el avatar cuando la pantalla obtiene el foco
  useFocusEffect(
    useCallback(() => {
      updateAvatar()
      return () => {
        // Cleanup opcional
      }
    }, [updateAvatar]),
  )

  // Filtrar movimientos basados en el texto de búsqueda
  useEffect(() => {
    if (searchText.trim() === "") {
      setMovements(MOCK_MOVEMENTS)
    } else {
      const filtered = MOCK_MOVEMENTS.filter(
        (movement) =>
          movement.title.toLowerCase().includes(searchText.toLowerCase()) ||
          movement.date.includes(searchText) ||
          movement.amount.includes(searchText),
      )
      setMovements(filtered)
    }
  }, [searchText])

  // Calcular el padding superior para el header
  const headerPaddingTop =
    Platform.OS === "ios" ? (hasNotchOrIsland ? statusBarHeight + 10 : statusBarHeight) : statusBarHeight

  // Renderizar cada item de movimiento
  const renderMovementItem = ({ item }: { item: Movement }) => {
    // Determinar el color de la barra lateral según el tipo de movimiento
    let barColor = "#FEC937" // Amarillo por defecto
    if (item.type === "chance") barColor = "#59CDF2" // Azul claro
    if (item.type === "lottery") barColor = "#F5F5DC" // Color hueso para lotería (antes era blanco)
    if (item.type === "international") barColor = "#7CDDB3" // Verde

    return (
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
              {item.logo ? (
                <Image source={item.logo} style={styles.logoImage} resizeMode="contain" />
              ) : (
                <Text style={styles.groupText}>Grupo {item.groupId}</Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.mainContainer}>
      {/* Fondo blanco para toda la pantalla */}
      <View style={styles.backgroundWhite} />

      {/* Imagen de fondo y contenido */}
      <ImageBackground source={require("../../assets/images/Fondo7_FORTU.png")} style={styles.background}>
        <StatusBar barStyle="light-content" backgroundColor="#2262CE" />
        <SafeAreaView style={styles.container}>
          <View style={[styles.header, { paddingTop: headerPaddingTop }]}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={() => navigation.navigate("Menu")} style={styles.backButton}>
                <Image source={require("../../assets/images/Menu.png")} style={styles.backIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.notificationButton}>
                <Image
                  source={require("../../assets/images/campana.png")}
                  style={styles.notificationIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.profileSection}>
            <TouchableOpacity style={styles.profileImageContainer}>
              <Image source={avatarSource} style={styles.profileImage} resizeMode="cover" />
            </TouchableOpacity>
            <View style={styles.profileInfo}>
              <Text style={styles.balanceLabel}>Saldo</Text>
              <Text style={styles.balanceAmount}>$ 87.600</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Mis movimientos</Text>

          <View style={styles.searchContainer}>
            <Image
              source={require("../../assets/images/search_icon.png")}
              style={styles.searchIcon}
              resizeMode="contain"
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar"
              placeholderTextColor="#FFFFFF80"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          <FlatList
            data={movements}
            renderItem={renderMovementItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.movementsList}
            showsVerticalScrollIndicator={false}
          />

          <TouchableOpacity style={styles.viewMoreButton}>
            <Text style={styles.viewMoreText}>Ver más movimientos</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  backgroundWhite: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
  },
  background: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 5,
    marginRight: 15,
  },
  backIcon: {
    width: 30,
    height: 30,
    marginTop: 5,
  },
  notificationButton: {
    padding: 5,
  },
  notificationIcon: {
    width: 30,
    height: 30,
    marginTop: 5,
  },
  profileSection: {
    alignItems: "flex-end",
    marginBottom: 25,
    marginTop: -15,
  },
  profileImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFFFFF",
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
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: "#FFFFFF",
    fontSize: 16,
  },
  movementsList: {
    paddingBottom: 10,
  },
  movementCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    marginBottom: 8,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 130,
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
  viewMoreButton: {
    alignItems: "center",
    paddingVertical: 15,
    marginBottom: 20,
  },
  viewMoreText: {
    color: "#2262CE",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default MovementsScreen
