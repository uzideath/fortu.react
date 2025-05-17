"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  ImageBackground,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native"
import type { MainScreenProps } from "src/types"
import { colors } from "src/styles/colors"
import { formatCurrency } from "src/utils/helpers"
import { getSelectedAvatar, avatarEvents, type AvatarInfo } from "src/services/avatarService"
import { getUserData, userDataEvents, type UserData } from "src/services/userDataService"

type MenuScreenProps = MainScreenProps<"Menu">

const { width, height } = Dimensions.get("window")

const MenuScreen: React.FC<MenuScreenProps> = ({ navigation }) => {
  const [balance, setBalance] = useState<string>("0")
  const [userName, setUserName] = useState<string>("Cargando...")
  const [avatarSource, setAvatarSource] = useState<any>(require("src/assets/images/profile_placeholder.jpg"))

  // Función para actualizar el avatar
  const updateAvatar = useCallback(async () => {
    try {
      const selectedAvatar = await getSelectedAvatar()
      if (selectedAvatar) {
        setAvatarSource(selectedAvatar.source)
      }
    } catch (error) {
      console.error("Error updating avatar:", error)
      // Usar la imagen proporcionada como avatar predeterminado en caso de error
      setAvatarSource(require("src/assets/images/profile_placeholder.jpg"))
    }
  }, [])

  // Función para actualizar los datos del usuario
  const updateUserData = useCallback(async () => {
    try {
      const userData = await getUserData()
      setBalance(userData.balance)
      setUserName(userData.name)
    } catch (error) {
      console.error("Error updating user data:", error)
    }
  }, [])

  // Escuchar cambios en el avatar
  useEffect(() => {
    // Suscribirse al evento de cambio de avatar
    const handleAvatarChange = (avatar: AvatarInfo) => {
      setAvatarSource(avatar.source)
    }

    avatarEvents.on("avatarChanged", handleAvatarChange)

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      avatarEvents.off("avatarChanged", handleAvatarChange)
    }
  }, [])

  // Escuchar cambios en los datos del usuario
  useEffect(() => {
    // Suscribirse al evento de cambio de datos del usuario
    const handleUserDataChange = (userData: UserData) => {
      setBalance(userData.balance)
      setUserName(userData.name)
    }

    userDataEvents.on("userDataChanged", handleUserDataChange)

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      userDataEvents.off("userDataChanged", handleUserDataChange)
    }
  }, [])

  // Cargar datos al montar el componente
  useEffect(() => {
    updateAvatar() // Actualizar avatar inmediatamente
    updateUserData() // Cargar datos del usuario
  }, [updateAvatar, updateUserData])

  // Recargar datos cada vez que la pantalla vuelve a estar en foco
  useFocusEffect(
    useCallback(() => {
      console.log("MenuScreen en foco, actualizando datos...")
      updateAvatar() // Actualizar avatar inmediatamente
      updateUserData() // Cargar datos del usuario
      return () => {
        // Cleanup opcional
      }
    }, [updateAvatar, updateUserData]),
  )

  const handlePaymentMethodsPress = (): void => {
    navigation.navigate("Home")
  }

  const handleLoadPaymentMethod = (): void => {
    navigation.navigate("LoadPaymentMethod")
  }

  const handleHomePress = (): void => {
    // Navegar al navegador Games, que automáticamente mostrará GamesHome como pantalla inicial
    navigation.navigate("Games")
  }

  const handleTicketsPress = (): void => {
    // Navegar a la pantalla de movimientos
    navigation.navigate("Movements")
  }

  const handleSettingsPress = (): void => {
    console.log("Navegando a Settings...")
    try {
      navigation.navigate("Settings")
      console.log("Navegación a Settings completada")
    } catch (error) {
      console.error("Error al navegar a Settings:", error)
      Alert.alert("Error de navegación", "No se pudo navegar a la pantalla de Ajustes.")
    }
  }

  const handleWalletPress = (): void => {
    // Implementar navegación a la billetera cuando esté disponible
    console.log("Navegando a Billetera...")
    Alert.alert("Información", "Funcionalidad de Billetera en desarrollo")
  }

  const handleWithdrawPress = (): void => {
    // Implementar la funcionalidad de retirar dinero
    console.log("Retirar dinero")
    Alert.alert("Información", "Funcionalidad de Retirar en desarrollo")
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <ImageBackground
        source={require("src/assets/images/Fondo6_FORTU.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          {/* Sección superior: Saldo y perfil */}
          <View style={styles.topSection}>
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>Saldo</Text>
              <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
            </View>

            <View style={styles.profileContainer}>
              <View style={styles.profileTextContainer}>
                <Text style={styles.profileLabel}>Nombre</Text>
                <Text style={styles.profileLabel}>de usuario</Text>
              </View>
              <View style={styles.profileImageContainer}>
                <Image source={avatarSource} style={styles.profileImage} />
              </View>
            </View>
          </View>

          {/* Sección de iconos de acción */}
          <View style={styles.actionsSection}>
            <TouchableOpacity style={styles.actionButton} onPress={handleHomePress}>
              <Image
                source={require("src/assets/images/inicio_icon.png")}
                style={styles.actionIconImage}
                resizeMode="contain"
              />
              <Text style={styles.actionText}>Inicio</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleLoadPaymentMethod}>
              <Image
                source={require("src/assets/images/Cargar.png")}
                style={styles.actionIconImage}
                resizeMode="contain"
              />
              <Text style={styles.actionText}>Cargar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleWithdrawPress}>
              <Image
                source={require("src/assets/images/Retirar.png")}
                style={styles.actionIconImage}
                resizeMode="contain"
              />
              <Text style={styles.actionText}>Retirar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleTicketsPress}>
              <Image
                source={require("src/assets/images/Tiquetes.png")}
                style={styles.actionIconImage}
                resizeMode="contain"
              />
              <Text style={styles.actionText}>Tiquetes</Text>
            </TouchableOpacity>
          </View>

          {/* Contenedor blanco para el resto del contenido */}
          <View style={styles.whiteContainerWrapper}>
            <View style={styles.whiteContainer}>
              {/* Opciones de menú */}
              <View style={styles.menuOptionsContainer}>
                <TouchableOpacity style={styles.menuOption} onPress={handleWalletPress}>
                  <View style={styles.menuOptionContent}>
                    <View style={styles.menuOptionIconContainer}>
                      <Image
                        source={require("src/assets/images/wallet_icon.png")}
                        style={styles.menuOptionIcon}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.menuOptionText}>Billetera</Text>
                  </View>
                  <Image
                    source={require("src/assets/images/arrow_right.png")}
                    style={styles.arrowIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuOption} onPress={handlePaymentMethodsPress}>
                  <View style={styles.menuOptionContent}>
                    <View style={styles.menuOptionIconContainer}>
                      <Image
                        source={require("src/assets/images/payment_icon.png")}
                        style={styles.menuOptionIcon}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.menuOptionText}>Medios de pago</Text>
                  </View>
                  <Image
                    source={require("src/assets/images/arrow_right.png")}
                    style={styles.arrowIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuOption} onPress={handleSettingsPress}>
                  <View style={styles.menuOptionContent}>
                    <View style={styles.menuOptionIconContainer}>
                      <Image
                        source={require("src/assets/images/settings_icon.png")}
                        style={styles.menuOptionIcon}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.menuOptionText}>Ajustes</Text>
                  </View>
                  <Image
                    source={require("src/assets/images/arrow_right.png")}
                    style={styles.arrowIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              {/* Banner promocional */}
              <View style={styles.bannerContainer}>
                <View style={styles.bannerTitleContainer}>
                  <Text style={styles.bannerTitle}>¿Fuiste uno de los afortunados?</Text>
                </View>
                <Image
                  source={require("src/assets/images/promo_banner.jpg")}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
                <View style={styles.paginationContainer}>
                  <View style={[styles.paginationDot, styles.activeDot]} />
                  <View style={styles.paginationDot} />
                  <View style={styles.paginationDot} />
                  <View style={styles.paginationDot} />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingTop: 20,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    marginBottom: 30,
  },
  balanceContainer: {
    alignItems: "flex-start",
  },
  balanceLabel: {
    fontSize: 18,
    color: colors.white,
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.white,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileTextContainer: {
    alignItems: "flex-end",
    marginRight: 10,
  },
  profileLabel: {
    fontSize: 16,
    color: colors.white,
    textAlign: "right",
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.white,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  actionsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },
  actionButton: {
    alignItems: "center",
  },
  actionIconImage: {
    width: 35,
    height: 35,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: colors.white,
  },
  whiteContainerWrapper: {
    paddingHorizontal: 15, // Margen para que no toque los bordes laterales
  },
  whiteContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  menuOptionsContainer: {
    marginBottom: 30,
  },
  menuOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuOptionIconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuOptionIcon: {
    width: 30,
    height: 30,
    tintColor: "#2262ce",
  },
  menuOptionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3f3f3f",
  },
  bannerContainer: {
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
  },
  bannerTitleContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(254, 201, 55, 0.8)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    zIndex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3f3f3f",
  },
  bannerImage: {
    width: "100%",
    height: 220,
    borderRadius: 15,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.white,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  arrowIcon: {
    width: 40,
    height: 40,
  },
})

export default MenuScreen
