"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ImageBackground,
  StatusBar,
  Alert,
  Dimensions,
} from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { MainStackParamList } from "../../types"
import ConfirmationModal from "../../components/modals/ConfirmationModal"

const { width } = Dimensions.get("window")
// Hacer las imágenes más pequeñas
const imageSize = (width - 80) / 2

type SettingsScreenNavigationProp = StackNavigationProp<MainStackParamList, "Settings">

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  // Estado para controlar la visibilidad del modal de confirmación
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false)

  // Añadimos un console.log para verificar que el componente se está renderizando
  console.log("Renderizando SettingsScreen")

  const handleBack = (): void => {
    console.log("Botón de retroceso presionado en SettingsScreen")
    navigation.goBack()
  }

  // Función para manejar el cierre de sesión
  const handleLogout = (): void => {
    console.log("Cerrando sesión y navegando a Login")
    // Reiniciar la pila de navegación y establecer Login como pantalla inicial
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" as any }],
    })
  }

  // Modificar la función handleOptionPress para manejar la opción "Cerrar sesión"
  const handleOptionPress = (option: string): void => {
    console.log(`Opción seleccionada: ${option}`)

    switch (option) {
      case "Tu info":
        console.log("Navegando a UserInfo")
        navigation.navigate("UserInfo")
        break
      case "Seguridad":
        console.log("Navegando a Security")
        navigation.navigate("Security")
        break
      case "Notificaciones":
        console.log("Navegando a Notifications")
        navigation.navigate("Notifications")
        break
      case "Cerrar sesión":
        // Mostrar el modal de confirmación personalizado
        setShowLogoutModal(true)
        break
      default:
        Alert.alert(`Opción seleccionada: ${option}`, `Has seleccionado la opción ${option}`)
        break
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ebebeb" />
      <ImageBackground
        source={require("../../assets/images/Fondo9_FORTU.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Image
              source={require("../../assets/images/back_button.png")}
              style={styles.backButtonImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Contenedor principal centrado verticalmente con ajuste */}
        <View style={styles.centeredContainer}>
          <View style={styles.contentContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Ajustes</Text>
              <Image
                source={require("../../assets/images/settings_gear_icon.png")}
                style={styles.titleIcon}
                resizeMode="contain"
              />
            </View>

            <View style={styles.optionsGrid}>
              <View style={styles.optionsRow}>
                <TouchableOpacity onPress={() => handleOptionPress("Tu info")} testID="user-info-button">
                  <Image
                    source={require("../../assets/images/tu_info_icon.png")}
                    style={styles.optionImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleOptionPress("Seguridad")} testID="security-button">
                  <Image
                    source={require("../../assets/images/seguridad_icon.png")}
                    style={styles.optionImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.optionsRow}>
                <TouchableOpacity onPress={() => handleOptionPress("Privacidad")}>
                  <Image
                    source={require("../../assets/images/privacidad_icon.png")}
                    style={styles.optionImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleOptionPress("Notificaciones")}>
                  <Image
                    source={require("../../assets/images/notificaciones_icon.png")}
                    style={styles.optionImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.optionsRow}>
                <TouchableOpacity onPress={() => handleOptionPress("Cerrar sesión")}>
                  <Image
                    source={require("../../assets/images/cerrar_sesion_icon.png")}
                    style={styles.optionImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleOptionPress("Ayuda y soporte")}>
                  <Image
                    source={require("../../assets/images/ayuda_soporte_icon.png")}
                    style={styles.optionImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* Espacio adicional para compensar el header */}
          <View style={styles.bottomSpacer} />
        </View>

        {/* Modal de confirmación personalizado */}
        <ConfirmationModal
          visible={showLogoutModal}
          title="Cerrar sesión"
          message="¿Estás seguro de que deseas cerrar sesión de tu cuenta?"
          confirmText="Sí, cerrar sesión"
          cancelText="Cancelar"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
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
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    height: 90, // Altura fija para el header
  },
  backButton: {
    width: 40,
    height: 40,
  },
  backButtonImage: {
    width: 40,
    height: 40,
  },
  // Contenedor centrado con ajuste para compensar el header
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: -20, // Ajuste para compensar el espacio del header
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#3f3f3f",
    marginRight: 10,
  },
  titleIcon: {
    width: 25,
    height: 25,
  },
  optionsGrid: {
    width: "100%",
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "center", // Cambio de "space-between" a "center"
    marginBottom: 10,
    width: "100%",
    paddingHorizontal: 10,
  },
  optionImage: {
    width: imageSize,
    height: imageSize,
    marginHorizontal: 10, // Añadir margen horizontal más pequeño entre imágenes
  },
  // Espacio adicional en la parte inferior para equilibrar
  bottomSpacer: {
    height: 40, // Ajustar según sea necesario para equilibrar
  },
})

export default SettingsScreen
