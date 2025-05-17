"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Dimensions,
  Animated,
  PanResponder,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useFocusEffect } from "@react-navigation/native"
import type { GamesScreenProps } from "src/types"
import { getSelectedAvatar, avatarEvents, type AvatarInfo } from "src/services/avatarService"
import { getUserData, userDataEvents, type UserData } from "src/services/userDataService"

const { width, height } = Dimensions.get("window")

// Datos para el carrusel de banners (5 imágenes)
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
  {
    id: "5",
    image: require("src/assets/images/baloto_banner.png"), // Usar la misma imagen para demostración
  },
]

const BANNER_HEIGHT = 200
const CARD_WIDTH = width * 0.8
const CARD_HEIGHT = BANNER_HEIGHT
const INITIAL_INDEX = 2 // Comenzar desde la tercera imagen (índice 2)

// Color de fondo para todos los botones
const BUTTON_BACKGROUND_COLOR = "#F4F4F4"

const GamesHomeScreen: React.FC<GamesScreenProps<"GamesHome">> = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const [userName, setUserName] = useState<string>("Usuario Demo")
  const [avatarSource, setAvatarSource] = useState<any>(null)
  const [currentIndex, setCurrentIndex] = useState(INITIAL_INDEX)
  const position = useRef(new Animated.Value(INITIAL_INDEX)).current
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null)

  // Función para actualizar el avatar
  const updateAvatar = useCallback(async () => {
    try {
      const currentAvatar = await getSelectedAvatar()
      if (currentAvatar) {
        setAvatarSource(currentAvatar.source)
      }
    } catch (error) {
      console.error("Error updating avatar:", error)
      setAvatarSource(require("src/assets/images/avatar12.png"))
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

  // Función para ir a un índice específico
  const goToIndex = useCallback(
    (index: number) => {
      Animated.spring(position, {
        toValue: index,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start(() => {
        setCurrentIndex(index)
      })
    },
    [position],
  )

  // Función para ir al siguiente slide
  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % bannerData.length
    goToIndex(nextIndex)
  }, [currentIndex, goToIndex])

  // Función para ir al slide anterior
  const goToPrev = useCallback(() => {
    const prevIndex = currentIndex === 0 ? bannerData.length - 1 : currentIndex - 1
    goToIndex(prevIndex)
  }, [currentIndex, goToIndex])

  // Iniciar/detener autoplay
  const startAutoPlay = useCallback(() => {
    if (autoPlayTimer.current) {
      clearInterval(autoPlayTimer.current)
    }
    autoPlayTimer.current = setInterval(goToNext, 3000)
  }, [goToNext])

  const stopAutoPlay = useCallback(() => {
    if (autoPlayTimer.current) {
      clearInterval(autoPlayTimer.current)
      autoPlayTimer.current = null
    }
  }, [])

  // Iniciar autoplay al montar el componente
  useEffect(() => {
    startAutoPlay()
    return () => stopAutoPlay()
  }, [startAutoPlay, stopAutoPlay])

  // Configurar el PanResponder para el carrusel
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        stopAutoPlay()
        position.stopAnimation()
      },
      onPanResponderMove: (_, { dx }) => {
        // Calcular el nuevo valor basado en el desplazamiento
        position.setValue(currentIndex - dx / 300)
      },
      onPanResponderRelease: (_, { dx }) => {
        // Determinar si el usuario ha deslizado lo suficiente
        if (dx > 50) {
          // Deslizamiento hacia la derecha (anterior)
          goToPrev()
        } else if (dx < -50) {
          // Deslizamiento hacia la izquierda (siguiente)
          goToNext()
        } else {
          // Volver al slide actual
          goToIndex(currentIndex)
        }

        // Reanudar autoplay
        startAutoPlay()
      },
    }),
  ).current

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

  // Navegar al menú al pulsar el avatar
  const handleAvatarPress = () => {
    navigation.navigate("Menu")
  }

  return (
    <ImageBackground
      source={require("src/assets/images/Fondo14_FORTU.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="#0b3e89" />
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.container}>
          {/* Header con campana y avatar */}
          <View style={[styles.header, { marginTop: insets.top > 0 ? 0 : 10 }]}>
            <View style={styles.headerLeft}>
              {/* Icono de campana movido a la posición del menú */}
              <TouchableOpacity style={styles.bellContainer}>
                <Image source={require("src/assets/images/campana.png")} style={styles.bellIcon} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.avatarContainer} onPress={handleAvatarPress}>
              {avatarSource ? (
                <Image source={avatarSource} style={styles.avatarImage} resizeMode="cover" />
              ) : (
                <Image
                  source={require("src/assets/images/avatar12.png")}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              )}
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

          {/* Carrusel de banners - NUEVA IMPLEMENTACIÓN */}
          <View style={styles.carouselContainer}>
            <View style={styles.carouselWrapper} {...panResponder.panHandlers}>
              {bannerData.map((item, index) => {
                // Calcular la posición relativa
                const inputRange = bannerData.map((_, i) => i)

                // Calcular la escala
                const scale = position.interpolate({
                  inputRange,
                  outputRange: inputRange.map((i) => (i === index ? 1 : 0.9)),
                  extrapolate: "clamp",
                })

                // Calcular la opacidad
                const opacity = position.interpolate({
                  inputRange,
                  outputRange: inputRange.map((i) => (i === index ? 1 : 0.6)),
                  extrapolate: "clamp",
                })

                // Calcular el desplazamiento horizontal
                const translateX = position.interpolate({
                  inputRange,
                  outputRange: inputRange.map((i) => {
                    if (i < index) return -width * 0.15
                    if (i > index) return width * 0.15
                    return 0
                  }),
                  extrapolate: "clamp",
                })

                // Calcular el desplazamiento vertical
                const translateY = position.interpolate({
                  inputRange,
                  outputRange: inputRange.map((i) => {
                    if (i < index) return 15
                    if (i > index) return 15
                    return 0
                  }),
                  extrapolate: "clamp",
                })

                // Calcular el z-index
                const zIndex =
                  index === currentIndex ? bannerData.length : bannerData.length - Math.abs(index - currentIndex)

                return (
                  <Animated.View
                    key={item.id}
                    style={[
                      styles.carouselCard,
                      {
                        zIndex,
                        opacity,
                        transform: [{ scale }, { translateX }, { translateY }],
                      },
                    ]}
                  >
                    <TouchableOpacity activeOpacity={0.9} onPress={() => goToIndex(index)} style={styles.cardTouchable}>
                      <Image source={item.image} style={styles.carouselImage} resizeMode="cover" />
                    </TouchableOpacity>
                  </Animated.View>
                )
              })}
            </View>

            {/* Indicadores de página */}
            <View style={styles.paginationContainer}>
              {bannerData.map((_, index) => (
                <TouchableOpacity key={index} onPress={() => goToIndex(index)}>
                  <View
                    style={[
                      styles.paginationDot,
                      index === currentIndex ? styles.paginationDotActive : styles.paginationDotInactive,
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Contenedor principal con fondo blanco redondeado */}
          <View style={styles.gameOptionsContainer}>
            <View style={styles.gameOptionsWrapper}>
              {/* Loterías en línea */}
              <TouchableOpacity
                style={[styles.gameOptionCard, { backgroundColor: BUTTON_BACKGROUND_COLOR }]}
                onPress={handleLotteriesPress}
              >
                <View style={styles.gameOptionIconContainer}>
                  <Image source={require("src/assets/images/lottery_icon.png")} style={styles.gameOptionIcon} />
                </View>
                <View style={styles.gameOptionTextContainer}>
                  <Text style={styles.gameOptionText}>Loterías en línea</Text>
                </View>
                <View style={styles.gameOptionArrow}>
                  <Image source={require("src/assets/images/arrow_right.png")} style={styles.arrowIcon} />
                </View>
              </TouchableOpacity>

              {/* Chance en línea */}
              <TouchableOpacity
                style={[styles.gameOptionCard, { backgroundColor: BUTTON_BACKGROUND_COLOR }]}
                onPress={handleChancePress}
              >
                <View style={styles.gameOptionIconContainer}>
                  <Image source={require("src/assets/images/chance_icon.png")} style={styles.gameOptionIcon} />
                </View>
                <View style={styles.gameOptionTextContainer}>
                  <Text style={styles.gameOptionText}>Chance en línea</Text>
                </View>
                <View style={styles.gameOptionArrow}>
                  <Image source={require("src/assets/images/arrow_right.png")} style={styles.arrowIcon} />
                </View>
              </TouchableOpacity>

              {/* Sorteos grupales */}
              <TouchableOpacity
                style={[styles.gameOptionCard, { backgroundColor: BUTTON_BACKGROUND_COLOR }]}
                onPress={handleGroupDrawPress}
              >
                <View style={styles.gameOptionIconContainer}>
                  <Image source={require("src/assets/images/group_icon.png")} style={styles.gameOptionIcon} />
                </View>
                <View style={styles.gameOptionTextContainer}>
                  <Text style={styles.gameOptionText}>Sorteos grupales</Text>
                </View>
                <View style={styles.gameOptionArrow}>
                  <Image source={require("src/assets/images/arrow_right.png")} style={styles.arrowIcon} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Espacio adicional para evitar superposición con el botón de soporte */}
            <View style={styles.supportButtonSpacer} />
          </View>

          {/* Botón de soporte flotante */}
          <TouchableOpacity style={styles.supportButton}>
            <Image source={require("src/assets/images/support_icon.png")} style={styles.supportIcon} />
          </TouchableOpacity>
        </View>
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
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  bellContainer: {
    // Sin marginLeft ya que ahora está en la posición del menú
  },
  bellIcon: {
    width: 30,
    height: 30,
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
    marginTop: 10,
  },
  greetingText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  sectionTitleContainer: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  // Nuevos estilos para el carrusel
  carouselContainer: {
    height: CARD_HEIGHT + 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  carouselWrapper: {
    width: width,
    height: CARD_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselCard: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTouchable: {
    width: "100%",
    height: "100%",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: "#FFFFFF",
  },
  paginationDotInactive: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  gameOptionsContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    marginTop: "auto", // Esto empuja el contenedor hacia abajo
    height: height * 0.45, // Ajusta la altura para que ocupe aproximadamente el 45% de la pantalla
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  gameOptionsWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gameOptionCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 15, // Aumentado para mayor separación entre tarjetas
    borderRadius: 15, // Bordes redondeados para las tarjetas
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "100%", // Asegurar que ocupe todo el ancho disponible
  },
  gameOptionIconContainer: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  gameOptionIcon: {
    width: 40,
    height: 40,
  },
  gameOptionTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gameOptionText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333333",
    textAlign: "center",
  },
  gameOptionArrow: {
    width: 40,
    height: 40,
    backgroundColor: "#2262CE",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowIcon: {
    width: 24,
    height: 24,
  },
  supportButtonSpacer: {
    height: 70, // Espacio adicional para evitar superposición con el botón de soporte
  },
  supportButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2262CE",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  supportIcon: {
    width: 30,
    height: 30,
  },
})

export default GamesHomeScreen
