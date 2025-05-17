"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StatusBar,
  Switch,
  ActivityIndicator,
  Image,
  Dimensions,
  Platform,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import type { MainScreenProps } from "src/types"
import AsyncStorage from "@react-native-async-storage/async-storage"
import SuccessModal from "src/components/modals/SuccessModal"

type NotificationsScreenProps = MainScreenProps<"Notifications">

// Interfaz para las preferencias de notificaciones
interface NotificationPreferences {
  emailNotifications: boolean
  marketingNotifications: boolean
  pushNotifications: boolean
  soundAlerts: boolean
}

// Clave para almacenar las preferencias en AsyncStorage
const NOTIFICATION_PREFS_KEY = "notification_preferences"

// Obtener dimensiones de la pantalla para diseño responsivo
const { width, height } = Dimensions.get("window")

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [successModalVisible, setSuccessModalVisible] = useState<boolean>(false)

  // Estado para las preferencias de notificaciones
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    marketingNotifications: false,
    pushNotifications: true,
    soundAlerts: false,
  })

  // Cargar preferencias guardadas al montar el componente
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedPrefs = await AsyncStorage.getItem(NOTIFICATION_PREFS_KEY)
        if (savedPrefs) {
          setPreferences(JSON.parse(savedPrefs))
        }
      } catch (error) {
        console.error("Error al cargar preferencias de notificaciones:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPreferences()
  }, [])

  // Manejador para cambiar una preferencia
  const handleTogglePreference = (key: keyof NotificationPreferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Manejador para guardar cambios
  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      // Emular una llamada al backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Guardar en AsyncStorage para persistencia local
      await AsyncStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(preferences))

      // Mostrar el modal de éxito
      setIsSaving(false)
      setSuccessModalVisible(true)
    } catch (error) {
      console.error("Error al guardar preferencias de notificaciones:", error)
      setIsSaving(false)
      // Aquí podríamos mostrar un modal de error si fuera necesario
    }
  }

  // Manejador para volver atrás
  const handleBackPress = () => {
    // Navegar explícitamente a SettingsScreen en lugar de usar goBack
    navigation.navigate("Settings")
  }

  // Manejador para cerrar el modal de éxito
  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false)
    // Navegar explícitamente a la pantalla de Settings
    navigation.navigate("Settings")
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Platform.OS === "android" ? "transparent" : undefined}
        translucent={Platform.OS === "android"}
      />
      <ImageBackground
        source={require("../../assets/images/Fondo12_FORTU.png")}
        style={styles.background}
        resizeMode="cover"
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2262ce" />
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollViewContent,
              {
                paddingTop: Platform.OS === "ios" ? 20 : insets.top + 20,
                paddingBottom: insets.bottom + 20,
              },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Botón de retroceso */}
            <TouchableOpacity
              style={[styles.backButton, Platform.OS === "ios" ? { marginTop: 20 } : { marginTop: 10 }]}
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <Image
                source={require("../../assets/images/back_button.png")}
                style={styles.backButtonImage}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Título */}
            <Text style={styles.title}>Notificaciones</Text>

            {/* Opciones de notificaciones */}
            <View style={styles.optionsContainer}>
              {/* Notificaciones por correo electrónico */}
              <View style={styles.optionItem}>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Notificaciones por correo electrónico</Text>
                  <Text style={styles.optionDescription}>
                    Recibe notificaciones por correo electrónico sobre la actividad de la cuenta
                  </Text>
                </View>
                <Switch
                  value={preferences.emailNotifications}
                  onValueChange={() => handleTogglePreference("emailNotifications")}
                  trackColor={{ false: "#d1d1d6", true: "#d1d1d6" }}
                  thumbColor={preferences.emailNotifications ? "#2262ce" : "#f4f3f4"}
                  ios_backgroundColor="#d1d1d6"
                  style={Platform.OS === "ios" ? styles.switchIOS : styles.switchAndroid}
                />
              </View>

              {/* Notificaciones de marketing */}
              <View style={styles.optionItem}>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Notificaciones de marketing</Text>
                  <Text style={styles.optionDescription}>
                    Recibe correos sobre nuevas funciones y ofertas especiales.
                  </Text>
                </View>
                <Switch
                  value={preferences.marketingNotifications}
                  onValueChange={() => handleTogglePreference("marketingNotifications")}
                  trackColor={{ false: "#d1d1d6", true: "#d1d1d6" }}
                  thumbColor={preferences.marketingNotifications ? "#2262ce" : "#f4f3f4"}
                  ios_backgroundColor="#d1d1d6"
                  style={Platform.OS === "ios" ? styles.switchIOS : styles.switchAndroid}
                />
              </View>

              {/* Separador */}
              <View style={styles.separator} />

              {/* Notificaciones push */}
              <View style={styles.optionItem}>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Notificaciones push</Text>
                  <Text style={styles.optionDescription}>Recibe notificaciones dentro de la aplicación.</Text>
                </View>
                <Switch
                  value={preferences.pushNotifications}
                  onValueChange={() => handleTogglePreference("pushNotifications")}
                  trackColor={{ false: "#d1d1d6", true: "#d1d1d6" }}
                  thumbColor={preferences.pushNotifications ? "#2262ce" : "#f4f3f4"}
                  ios_backgroundColor="#d1d1d6"
                  style={Platform.OS === "ios" ? styles.switchIOS : styles.switchAndroid}
                />
              </View>

              {/* Alertas de sonido */}
              <View style={styles.optionItem}>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Alertas de sonido</Text>
                  <Text style={styles.optionDescription}>Reproduce un sonido al recibir notificaciones.</Text>
                </View>
                <Switch
                  value={preferences.soundAlerts}
                  onValueChange={() => handleTogglePreference("soundAlerts")}
                  trackColor={{ false: "#d1d1d6", true: "#d1d1d6" }}
                  thumbColor={preferences.soundAlerts ? "#2262ce" : "#f4f3f4"}
                  ios_backgroundColor="#d1d1d6"
                  style={Platform.OS === "ios" ? styles.switchIOS : styles.switchAndroid}
                />
              </View>
            </View>

            {/* Botón de guardar cambios */}
            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSaveChanges}
              disabled={isSaving}
              activeOpacity={0.8}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.saveButtonText}>Guardar cambios</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* Modal de éxito */}
        <SuccessModal
          visible={successModalVisible}
          title="¡Cambios guardados!"
          message="Tus preferencias de notificaciones han sido actualizadas correctamente."
          buttonText="Aceptar"
          onClose={handleSuccessModalClose}
        />
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebebeb",
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  backButton: {
    marginLeft: 20,
    marginBottom: 20,
    width: 40,
    height: 40,
  },
  backButtonImage: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#3f3f3f",
    marginBottom: 40,
    marginLeft: 30,
  },
  optionsContainer: {
    paddingHorizontal: 30,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  optionTextContainer: {
    flex: 1,
    paddingRight: 20,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#3f3f3f",
    marginBottom: 5,
  },
  optionDescription: {
    fontSize: 14,
    color: "#7f7f7f",
    lineHeight: 20,
  },
  switchIOS: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  switchAndroid: {
    // Android switches tienen un aspecto diferente por defecto
  },
  separator: {
    height: 1,
    backgroundColor: "#d1d1d6",
    marginVertical: 20,
  },
  saveButton: {
    backgroundColor: "#59cdf2",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    marginHorizontal: 30,
    marginTop: 30,
    // Sombra para iOS
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      // Elevación para Android
      android: {
        elevation: 3,
      },
    }),
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default NotificationsScreen
