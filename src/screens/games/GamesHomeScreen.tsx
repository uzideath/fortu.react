"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Dimensions,
  ScrollView,
  FlatList,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useFocusEffect } from "@react-navigation/native"
import type { GamesScreenProps } from "src/types"
import { getSelectedAvatar, avatarEvents, type AvatarInfo } from "src/services/avatarService"
import { getUserData, userDataEvents, type UserData } from "src/services/userDataService"

const { width, height } = Dimensions.get("window")

// Datos para el carrusel de banners
const bannerData = [
  {
    id: "1",
    image: require("src/assets/images/baloto_banner.png"),
  },
  {
    id: "2",
    image: require("src/assets/images/baloto_banner.png"), // Usar la misma imagen para demostración
  },
  {
    id: "3",
    image: require("src/assets/images/baloto_banner.png"), // Usar la misma imagen para demostración
  },
  {
    id: "4",
    image: require("src/assets/images/baloto_banner.png"), // Usar la misma imagen para demostración
  },
]

const GamesHomeScreen: React.FC<GamesScreenProps<"GamesHome">> = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const [userName, setUserName] = useState<string>("Usuario")
  const [avatarSource, setAvatarSource] = useState<any>(null)
  const [activeSlide, setActiveSlide] = useState(0)

  // Función para actualizar el avatar
  const updateAvatar = useCallback(async () => {
    try {
      const currentAvatar = await getSelectedAvatar()
      if (currentAvatar) {
        setAvatarSource(currentAvatar.source)
      }
    } catch (error) {
      console.error("Error updating avatar:", error)
      setAvatarSource(require("src/assets/images/profile_placeholder.jpg"))
    }
  }, [])

  // Función para actualizar los datos del usuario
  const updateUserData = useCallback(async () => {
    try {
      const userData = await getUserData()
      setUserName(userData.name)
    } catch (error) {
      console.error("Error updating user data:", error)
    }
  }, [])

  // Cargar datos al montar el componente
  useEffect(() => {
    updateAvatar()
    updateUserData()
  }, [updateAvatar, updateUserData])

  // Actualizar datos cuando la pantalla obtiene el foco
  useFocusEffect(
    useCallback(() => {
      updateAvatar()
      updateUserData()
      return () => {
        // Cleanup opcional
      }
    }, [updateAvatar, updateUserData]),
  )

  // Escuchar cambios en el avatar
  useEffect(() => {
    const handleAvatarChange = (avatar: AvatarInfo) => {
      setAvatarSource(avatar.source)
    }

    avatarEvents.on("avatarChanged", handleAvatarChange)
    return () => {
      avatarEvents.off("avatarChanged", handleAvatarChange)
    }
  }, [])

  // Escuchar cambios en los datos del usuario
  useEffect(() => {
    const handleUserDataChange = (userData: UserData) => {
      setUserName(userData.name)
    }

    userDataEvents.on("userDataChanged", handleUserDataChange)
    return () => {
      userDataEvents.off("userDataChanged", handleUserDataChange)
    }
  }, [])

  // Renderizar un ítem del carrusel
  const renderBannerItem = ({ item }: { item: { id: string; image: any } }) => {
    return (
      <View style={styles.bannerItemContainer}>
        <Image source={item.image} style={styles.bannerImage} resizeMode="cover" />
      </View>
    )
  }

  // Manejar el cambio de slide en el carrusel
  const handleSlideChange = (event: any) => {
    const slideIndex = Math.floor(event.nativeEvent.contentOffset.x / (width * 0.9))
    if (slideIndex >= 0 && slideIndex < bannerData.length) {
      setActiveSlide(slideIndex)
    }
  }

  // Navegar a la pantalla de loterías
  const handleLotteriesPress = () => {
    navigation.navigate("LotteriesList")
  }

  // Navegar a la pantalla de chance
  const handleChancePress = () => {
    navigation.navigate("GamesList")
  }

  // Navegar a la pantalla de sorteos grupales
  const handleGroupDrawPress = () => {
    navigation.navigate("GroupDraw")
  }

  // Navegar al menú principal
  const handleMenuPress = () => {
    navigation.navigate("Menu")
  }

  return (
    <ImageBackground
      source={require("src/assets/images/Fondo14_FORTU.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="#2262CE" />
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header con logo, campana y avatar */}
          <View style={[styles.header, { marginTop: insets.top }]}>
            <TouchableOpacity onPress={handleMenuPress} style={styles.logoContainer}>
              <Image source={require("src/assets/images/menu_icon.png")} style={styles.logoIcon} resizeMode="contain" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.bellContainer}>
              <Image
                source={require("src/assets/images/notification_icon.png")}
                style={styles.bellIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.avatarContainer}>
              <Image
                source={avatarSource || require("src/assets/images/profile_placeholder.jpg")}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>

          {/* Saludo al usuario */}
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>¡Hola {userName}!</Text>
          </View>

          {/* Título de servicios */}
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Servicios en línea</Text>
          </View>

          {/* Carrusel de banners */}
          <View style={styles.bannerContainer}>
            <FlatList
              data={bannerData}
              renderItem={renderBannerItem}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={width * 0.9 + 20}
              decelerationRate="fast"
              contentContainerStyle={styles.bannerList}
              onScroll={handleSlideChange}
              scrollEventThrottle={16}
            />

            {/* Indicadores de página */}
            <View style={styles.paginationContainer}>
              {bannerData.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === activeSlide ? styles.paginationDotActive : styles.paginationDotInactive,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Opciones de juego */}
          <View style={styles.gameOptionsContainer}>
            {/* Loterías en línea */}
            <TouchableOpacity style={styles.gameOptionCard} onPress={handleLotteriesPress}>
              <View style={styles.gameOptionContent}>
                <Image
                  source={require("src/assets/images/lottery_icon.png")}
                  style={styles.gameOptionIcon}
                  resizeMode="contain"
                />
                <Text style={styles.gameOptionText}>Loterías en línea</Text>
              </View>
              <View style={styles.gameOptionArrow}>
                <Image
                  source={require("src/assets/images/arrow_right.png")}
                  style={styles.arrowIcon}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>

            {/* Chance en línea */}
            <TouchableOpacity style={styles.gameOptionCard} onPress={handleChancePress}>
              <View style={styles.gameOptionContent}>
                <Image
                  source={require("src/assets/images/chance_icon.png")}
                  style={styles.gameOptionIcon}
                  resizeMode="contain"
                />
                <Text style={styles.gameOptionText}>Chance en línea</Text>
              </View>
              <View style={styles.gameOptionArrow}>
                <Image
                  source={require("src/assets/images/arrow_right.png")}
                  style={styles.arrowIcon}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>

            {/* Sorteos grupales */}
            <TouchableOpacity style={styles.gameOptionCard} onPress={handleGroupDrawPress}>
              <View style={styles.gameOptionContent}>
                <Image
                  source={require("src/assets/images/group_icon.png")}
                  style={styles.gameOptionIcon}
                  resizeMode="contain"
                />
                <Text style={styles.gameOptionText}>Sorteos grupales</Text>
              </View>
              <View style={styles.gameOptionArrow}>
                <Image
                  source={require("src/assets/images/arrow_right.png")}
                  style={styles.arrowIcon}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Espacio adicional al final */}
          <View style={styles.bottomSpace} />
        </ScrollView>
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
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logoContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  logoIcon: {
    width: 30,
    height: 30,
    tintColor: "#FFFFFF",
  },
  bellContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  bellIcon: {
    width: 30,
    height: 30,
    tintColor: "#FFFFFF",
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  greetingContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  greetingText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  sectionTitleContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  bannerContainer: {
    marginBottom: 30,
  },
  bannerList: {
    paddingHorizontal: 10,
  },
  bannerItemContainer: {
    width: width * 0.9,
    height: 200,
    marginHorizontal: 10,
    borderRadius: 20,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: "#FFFFFF",
  },
  paginationDotInactive: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  gameOptionsContainer: {
    paddingHorizontal: 20,
  },
  gameOptionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  gameOptionIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
    tintColor: "#2262CE",
  },
  gameOptionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  gameOptionArrow: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowIcon: {
    width: 30,
    height: 30,
    tintColor: "#2262CE",
  },
  bottomSpace: {
    height: 50,
  },
})

export default GamesHomeScreen
