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
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { MainStackParamList } from "../../types"
import { colors } from "../../styles/colors"

type SecurityScreenNavigationProp = StackNavigationProp<MainStackParamList, "Security">

interface SecurityScreenProps {
  navigation: SecurityScreenNavigationProp
}

const SecurityScreen: React.FC<SecurityScreenProps> = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false)
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)

  const handleBack = (): void => {
    navigation.goBack()
  }

  const validatePassword = (): boolean => {
    if (!currentPassword) {
      Alert.alert("Error", "Por favor, ingresa tu contraseña actual.")
      return false
    }

    if (newPassword.length < 8) {
      Alert.alert("Error", "La nueva contraseña debe tener al menos 8 caracteres.")
      return false
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.")
      return false
    }

    return true
  }

  const handleUpdatePassword = async (): Promise<void> => {
    if (!validatePassword()) return

    setIsUpdating(true)

    try {
      // Aquí iría la lógica para actualizar la contraseña en el backend
      // Por ahora, simularemos una actualización exitosa
      await new Promise((resolve) => setTimeout(resolve, 1000))

      Alert.alert("Contraseña actualizada", "Tu contraseña ha sido actualizada exitosamente.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ])
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la contraseña. Inténtalo de nuevo.")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ebebeb" />
      <ImageBackground
        source={require("../../assets/images/Fondo11_FORTU.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
            {/* Botón de retroceso */}
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <View style={styles.backButtonCircle}>
                <Text style={styles.backButtonText}>←</Text>
              </View>
            </TouchableOpacity>

            {/* Título y subtítulo */}
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Seguridad</Text>
              <Text style={styles.subtitle}>
                Administra tu contraseña y la configuración de seguridad de la cuenta.
              </Text>
            </View>

            {/* Sección de cambio de contraseña */}
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Cambiar contraseña</Text>

              {/* Contraseña actual */}
              <Text style={styles.inputLabel}>Contraseña actual</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder=""
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!showCurrentPassword}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                  <Text style={styles.eyeIcon}>{showCurrentPassword ? "👁️" : "👁️‍🗨️"}</Text>
                </TouchableOpacity>
              </View>

              {/* Nueva contraseña */}
              <Text style={styles.inputLabel}>Nueva contraseña</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder=""
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowNewPassword(!showNewPassword)}>
                  <Text style={styles.eyeIcon}>{showNewPassword ? "👁️" : "👁️‍🗨️"}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.passwordHint}>La contraseña debe tener al menos 8 caracteres.</Text>

              {/* Confirmar nueva contraseña */}
              <Text style={styles.inputLabel}>Confirmar nueva contraseña</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder=""
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Text style={styles.eyeIcon}>{showConfirmPassword ? "👁️" : "👁️‍🗨️"}</Text>
                </TouchableOpacity>
              </View>

              {/* Botón de actualizar */}
              <TouchableOpacity
                style={[styles.updateButton, isUpdating && styles.updateButtonDisabled]}
                onPress={handleUpdatePassword}
                disabled={isUpdating}
              >
                <Text style={styles.updateButtonText}>{isUpdating ? "Actualizando..." : "Actualizar contraseña"}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
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
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  headerContainer: {
    paddingHorizontal: 30,
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#3f3f3f",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#7f7f7f",
    lineHeight: 24,
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#595959",
    marginBottom: 10,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 5,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: colors.text.primary,
  },
  eyeButton: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  passwordHint: {
    fontSize: 14,
    color: "#7f7f7f",
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: colors.secondary,
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 30,
  },
  updateButtonDisabled: {
    opacity: 0.7,
  },
  updateButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  eyeIcon: {
    fontSize: 20,
    color: "#595959",
  },
})

export default SecurityScreen
