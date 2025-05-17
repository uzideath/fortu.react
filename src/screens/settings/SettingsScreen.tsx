"use client"

import type React from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  StatusBar,
  Dimensions,
} from "react-native"
import { useState, useEffect, useCallback } from "react"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useFocusEffect } from "@react-navigation/native"
import type { MainScreenProps } from "src/types"
import { authService } from "src/services/auth"
import CustomAlert from "src/components/common/CustomAlert"
import DevelopmentModal from "src/components/modals/DevelopmentModal"
import { getSelectedAvatar, avatarEvents, type AvatarInfo } from "src/services/avatarService"

type SettingsScreenProps = MainScreenProps<"Settings">

const { width } = Dimensions.get("window")

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const [logoutAlertVisible, setLogoutAlertVisible] = useState(false)
  const [avatarSource, setAvatarSource] = useState<any>(null)

  // Estado para el modal de desarrollo
  const [developmentModalVisible, setDevelopmentModalVisible] = useState(false)
  const [developmentModalTitle, setDevelopmentModalTitle] = useState("")
  const [developmentModalMessage, setDevelopmentModalMessage] = useState("")

  // Función para actualizar el avatar
  const updateAvatar = useCallback(async () => {
    try {
      const selectedAvatar = await getSelectedAvatar()
      if (selectedAvatar) {
        setAvatarSource(selectedAvatar.source)
      }
    } catch (error) {
      console.error("Error updating avatar:", error)
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

  // Cargar avatar al montar el componente
  useEffect(() => {
    updateAvatar()
  }, [updateAvatar])

  // Recargar avatar cada vez que la pantalla vuelve a estar en foco
  useFocusEffect(
    useCallback(() => {
      updateAvatar()
      return () => {
        // Cleanup opcional
      }
    }, [updateAvatar]),
  )

  const handleBackPress = () => {
    // Navegar explícitamente a MenuScreen en lugar de usar goBack
    navigation.navigate("Menu")
  }

  const handleUserInfoPress = () => {
    // Navegar a la pantalla de información del usuario
    navigation.navigate("UserInfo")
  }

  const handleSecurityPress = () => {
    // Navegar a la pantalla de seguridad
    navigation.navigate("Security")
  }

  const handlePrivacyPress = () => {
    // Mostrar modal de desarrollo para Privacidad
    setDevelopmentModalTitle("Privacidad")
    setDevelopmentModalMessage(
      "Estamos trabajando en esta funcionalidad. Pronto podrás gestionar tus preferencias de privacidad.",
    )
    setDevelopmentModalVisible(true)
  }

  const handleNotificationsPress = () => {
    // Navegar a la pantalla de notificaciones
    navigation.navigate("Notifications")
  }

  const handleLogoutPress = () => {
    // Mostrar el diálogo personalizado de confirmación
    setLogoutAlertVisible(true)
  }

  const handleLogoutConfirm = async () => {
    try {
      // Ocultar el diálogo
      setLogoutAlertVisible(false)

      // Llamar al servicio de autenticación para cerrar sesión
      await authService.logout()

      // Navegar a la pantalla de inicio de sesión
      navigation.navigate("Login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  const handleLogoutCancel = () => {
    // Ocultar el diálogo
    setLogoutAlertVisible(false)
  }

  const handleHelpSupportPress = () => {
    // Mostrar modal de desarrollo para Ayuda y soporte
    setDevelopmentModalTitle("Ayuda y soporte")
    setDevelopmentModalMessage(
      "Estamos mejorando nuestro sistema de soporte. Pronto podrás acceder a ayuda personalizada y recursos de soporte.",
    )
    setDevelopmentModalVisible(true)
  }

  const handleCloseDevelopmentModal = () => {
    setDevelopmentModalVisible(false)
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={require("src/assets/images/Fondo9_FORTU.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={[styles.content, { paddingTop: insets.top }]}>
          {/* Botón de regreso */}
          <TouchableOpacity
            style={[styles.backButton, { top: insets.top + 10 }]}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Image source={require("src/assets/images/back_button.png")} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>

          {/* Avatar del usuario */}
          {avatarSource && (
            <View style={[styles.avatarContainer, { top: insets.top + 10 }]}>
              <Image source={avatarSource} style={styles.avatarImage} />
            </View>
          )}

          {/* Título de la pantalla - Posicionado absolutamente para no afectar el layout */}
          <View style={[styles.titleContainer, { top: insets.top + 60 }]}>
            <Text style={styles.titleText}>Ajustes</Text>
            <Image
              source={require("src/assets/images/settings_icon.png")}
              style={styles.titleIcon}
              resizeMode="contain"
            />
          </View>

          {/* Contenedor de opciones - Con paddingTop para dejar espacio al título */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollViewContent, { paddingTop: 120 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.optionsContainer}>
              {/* Fila 1: Tu info y Seguridad */}
              <View style={styles.optionsRow}>
                <TouchableOpacity style={styles.optionButton} onPress={handleUserInfoPress} activeOpacity={0.8}>
                  <Image
                    source={require("src/assets/images/tu_info_icon.png")}
                    style={styles.optionImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionButton} onPress={handleSecurityPress} activeOpacity={0.8}>
                  <Image
                    source={require("src/assets/images/seguridad_icon.png")}
                    style={styles.optionImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>

              {/* Fila 2: Privacidad y Notificaciones */}
              <View style={styles.optionsRow}>
                <TouchableOpacity style={styles.optionButton} onPress={handlePrivacyPress} activeOpacity={0.8}>
                  <Image
                    source={require("src/assets/images/privacidad_icon.png")}
                    style={styles.optionImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionButton} onPress={handleNotificationsPress} activeOpacity={0.8}>
                  <Image
                    source={require("src/assets/images/notificaciones_icon.png")}
                    style={styles.optionImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>

              {/* Fila 3: Cerrar sesión y Ayuda y soporte */}
              <View style={styles.optionsRow}>
                <TouchableOpacity style={styles.optionButton} onPress={handleLogoutPress} activeOpacity={0.8}>
                  <Image
                    source={require("src/assets/images/cerrar_sesion_icon.png")}
                    style={styles.optionImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionButton} onPress={handleHelpSupportPress} activeOpacity={0.8}>
                  <Image
                    source={require("src/assets/images/ayuda_soporte_icon.png")}
                    style={styles.optionImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Alerta personalizada para cerrar sesión */}
          <CustomAlert
            visible={logoutAlertVisible}
            title="Cerrar sesión"
            message="¿Estás seguro que deseas cerrar sesión?"
            onCancel={handleLogoutCancel}
            onConfirm={handleLogoutConfirm}
            cancelText="Cancelar"
            confirmText="Sí, cerrar sesión"
          />

          {/* Modal de desarrollo */}
          <DevelopmentModal
            visible={developmentModalVisible}
            title={developmentModalTitle}
            message={developmentModalMessage}
            buttonText="Entendido"
            onClose={handleCloseDevelopmentModal}
          />
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 30,
  },
  backButton: {
    position: "absolute",
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
  },
  backIcon: {
    width: 40,
    height: 40,
  },
  avatarContainer: {
    position: "absolute",
    right: 20,
    zIndex: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  titleContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    alignSelf: "center",
    zIndex: 5,
  },
  titleText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#3f3f3f",
    marginRight: 10,
  },
  titleIcon: {
    width: 30,
    height: 30,
    tintColor: "#2262ce",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 25,
  },
  optionButton: {
    width: width * 0.38,
    height: width * 0.38,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  optionImage: {
    width: "100%",
    height: "100%",
  },
})

export default SettingsScreen
