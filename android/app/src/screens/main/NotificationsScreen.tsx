"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  StatusBar,
  Switch,
  Alert,
  ScrollView,
} from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { MainStackParamList } from "../../types"
import { Image } from "react-native"

type NotificationsScreenNavigationProp = StackNavigationProp<MainStackParamList, "Notifications">

interface NotificationsScreenProps {
  navigation: NotificationsScreenNavigationProp
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  // Estados para los switches
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true)
  const [marketingNotifications, setMarketingNotifications] = useState<boolean>(false)
  const [pushNotifications, setPushNotifications] = useState<boolean>(true)
  const [soundAlerts, setSoundAlerts] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleBack = (): void => {
    navigation.goBack()
  }

  const handleSaveChanges = async (): Promise<void> => {
    setIsLoading(true)

    try {
      // Aquí iría la lógica para guardar las preferencias de notificaciones
      // Por ahora, simularemos una actualización exitosa
      await new Promise((resolve) => setTimeout(resolve, 1000))

      Alert.alert("Cambios guardados", "Tus preferencias de notificaciones han sido actualizadas.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ])
    } catch (error) {
      Alert.alert("Error", "No se pudieron guardar los cambios. Inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ebebeb" />
      <ImageBackground
        source={require("../../assets/images/Fondo12_FORTU.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          {/* Botón de retroceso */}
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
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
                trackColor={{ false: "#d1d1d6", true: "#d1d1d6" }}
                thumbColor={emailNotifications ? "#2262ce" : "#f4f3f4"}
                ios_backgroundColor="#d1d1d6"
                onValueChange={setEmailNotifications}
                value={emailNotifications}
                style={styles.switch}
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
                trackColor={{ false: "#d1d1d6", true: "#d1d1d6" }}
                thumbColor={marketingNotifications ? "#2262ce" : "#f4f3f4"}
                ios_backgroundColor="#d1d1d6"
                onValueChange={setMarketingNotifications}
                value={marketingNotifications}
                style={styles.switch}
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
                trackColor={{ false: "#d1d1d6", true: "#d1d1d6" }}
                thumbColor={pushNotifications ? "#2262ce" : "#f4f3f4"}
                ios_backgroundColor="#d1d1d6"
                onValueChange={setPushNotifications}
                value={pushNotifications}
                style={styles.switch}
              />
            </View>

            {/* Alertas de sonido */}
            <View style={styles.optionItem}>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Alertas de sonido</Text>
                <Text style={styles.optionDescription}>Reproduce un sonido al recibir notificaciones.</Text>
              </View>
              <Switch
                trackColor={{ false: "#d1d1d6", true: "#d1d1d6" }}
                thumbColor={soundAlerts ? "#2262ce" : "#f4f3f4"}
                ios_backgroundColor="#d1d1d6"
                onValueChange={setSoundAlerts}
                value={soundAlerts}
                style={styles.switch}
              />
            </View>
          </View>

          {/* Botón de guardar cambios */}
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSaveChanges}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>{isLoading ? "Guardando..." : "Guardar cambios"}</Text>
          </TouchableOpacity>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  backButton: {
    marginTop: 40,
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
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
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
