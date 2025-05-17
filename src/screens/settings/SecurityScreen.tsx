"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import type { MainScreenProps } from "src/types"
import Ionicons from "react-native-vector-icons/Ionicons"
import { updatePassword } from "src/services/securityService"

type SecurityScreenProps = MainScreenProps<"Security">

// Componente para el modal de éxito
const SuccessModal: React.FC<{
  visible: boolean
  onClose: () => void
}> = ({ visible, onClose }) => {
  // Animaciones
  const scaleAnim = useRef(new Animated.Value(0.5)).current
  const opacityAnim = useRef(new Animated.Value(0)).current
  const checkmarkOpacityAnim = useRef(new Animated.Value(0)).current
  const checkmarkScaleAnim = useRef(new Animated.Value(0.5)).current

  useEffect(() => {
    if (visible) {
      // Resetear animaciones
      scaleAnim.setValue(0.5)
      opacityAnim.setValue(0)
      checkmarkOpacityAnim.setValue(0)
      checkmarkScaleAnim.setValue(0.5)

      // Animar entrada del modal
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()

      // Animar checkmark después de un pequeño retraso
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(checkmarkOpacityAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(checkmarkScaleAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
            easing: Easing.out(Easing.back(1.7)),
          }),
        ]).start()
      }, 300)
    }
  }, [visible, scaleAnim, opacityAnim, checkmarkOpacityAnim, checkmarkScaleAnim])

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.modalContent}>
            {/* Círculo de éxito con checkmark */}
            <View style={styles.successCircleContainer}>
              <View style={styles.successCircle}>
                <Animated.Text
                  style={[
                    styles.checkmark,
                    {
                      opacity: checkmarkOpacityAnim,
                      transform: [{ scale: checkmarkScaleAnim }],
                    },
                  ]}
                >
                  ✓
                </Animated.Text>
              </View>
            </View>

            <Text style={styles.modalTitle}>¡Contraseña actualizada!</Text>
            <Text style={styles.modalMessage}>Tu contraseña ha sido actualizada correctamente.</Text>

            <TouchableOpacity style={styles.modalButton} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.modalButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

// Componente para el modal de error
const ErrorModal: React.FC<{
  visible: boolean
  message: string
  onClose: () => void
}> = ({ visible, message, onClose }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.errorCircleContainer}>
              <View style={styles.errorCircle}>
                <Text style={styles.errorIcon}>!</Text>
              </View>
            </View>

            <Text style={styles.modalTitle}>Error</Text>
            <Text style={styles.modalMessage}>{message}</Text>

            <TouchableOpacity style={styles.modalButton} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.modalButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

// Componente para los requisitos de contraseña
const PasswordRequirement: React.FC<{
  label: string
  isMet: boolean
}> = ({ label, isMet }) => {
  return (
    <View style={styles.requirementContainer}>
      <View style={[styles.requirementDot, isMet ? styles.requirementMet : styles.requirementNotMet]}>
        {isMet && <Text style={styles.requirementDotText}>✓</Text>}
      </View>
      <Text style={[styles.requirementText, isMet ? styles.requirementTextMet : styles.requirementTextNotMet]}>
        {label}
      </Text>
    </View>
  )
}

const SecurityScreen: React.FC<SecurityScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const [currentPassword, setCurrentPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [successModalVisible, setSuccessModalVisible] = useState<boolean>(false)
  const [errorModalVisible, setErrorModalVisible] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)

  // Estados para controlar la visibilidad de las contraseñas
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false)
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  // Estados para validación
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true)
  const [passwordTouched, setPasswordTouched] = useState<boolean>(false)

  // Validaciones de contraseña
  const hasMinLength = newPassword.length >= 8
  const hasUpperCase = /[A-Z]/.test(newPassword)
  const hasLowerCase = /[a-z]/.test(newPassword)
  const hasNumber = /[0-9]/.test(newPassword)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)

  // Verificar si todos los campos están rellenados
  const allFieldsFilled = currentPassword.length > 0 && newPassword.length > 0 && confirmPassword.length > 0

  // Verificar si las contraseñas coinciden
  useEffect(() => {
    setPasswordsMatch(newPassword === confirmPassword)
  }, [newPassword, confirmPassword])

  const handleBackPress = () => {
    // Navegar explícitamente a SettingsScreen en lugar de usar goBack
    navigation.navigate("Settings")
  }

  const handleUpdatePassword = async () => {
    // Marcar el formulario como enviado para mostrar errores
    setFormSubmitted(true)

    // Validar que los campos no estén vacíos
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("Por favor, completa todos los campos.")
      setErrorModalVisible(true)
      return
    }

    // Validar requisitos de contraseña
    if (!hasMinLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      setErrorMessage("La nueva contraseña no cumple con los requisitos de seguridad.")
      setErrorModalVisible(true)
      return
    }

    // Validar que las contraseñas coincidan
    if (!passwordsMatch) {
      setErrorMessage("Las contraseñas no coinciden.")
      setErrorModalVisible(true)
      return
    }

    // Iniciar proceso de actualización
    setIsLoading(true)

    try {
      // Verificar la contraseña actual y actualizar a la nueva
      const result = await updatePassword(currentPassword, newPassword)

      setIsLoading(false)

      if (result.success) {
        // Mostrar modal de éxito
        setSuccessModalVisible(true)
      } else {
        // Mostrar error
        setErrorMessage(result.message)
        setErrorModalVisible(true)
      }
    } catch (error) {
      setIsLoading(false)
      setErrorMessage("Ocurrió un error al actualizar la contraseña. Intenta nuevamente.")
      setErrorModalVisible(true)
      console.error("Error al actualizar contraseña:", error)
    }
  }

  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false)
    // Limpiar los campos después de actualizar
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setPasswordTouched(false)
    setFormSubmitted(false)

    // Navegar explícitamente a la pantalla de ajustes
    navigation.navigate("Settings")
  }

  const handleErrorModalClose = () => {
    setErrorModalVisible(false)
  }

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    if (field === "current") {
      setShowCurrentPassword(!showCurrentPassword)
    } else if (field === "new") {
      setShowNewPassword(!showNewPassword)
    } else {
      setShowConfirmPassword(!showConfirmPassword)
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={require("../../assets/images/Fondo11_FORTU.png")}
        style={styles.background}
        resizeMode="cover"
      >
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#2262ce" />
          </View>
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollViewContent, { paddingTop: insets.top }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Botón de regreso */}
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress} activeOpacity={0.7}>
              <Image
                source={require("../../assets/images/back_button.png")}
                style={styles.backButtonImage}
                resizeMode="contain"
              />
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
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputWithIcon}
                  secureTextEntry={!showCurrentPassword}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder=""
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => togglePasswordVisibility("current")}
                  activeOpacity={0.7}
                >
                  <Ionicons name={showCurrentPassword ? "eye-off" : "eye"} size={24} color="#7f7f7f" />
                </TouchableOpacity>
              </View>

              {/* Nueva contraseña */}
              <Text style={styles.inputLabel}>Nueva contraseña</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputWithIcon}
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text)
                    setPasswordTouched(true)
                  }}
                  placeholder=""
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => togglePasswordVisibility("new")}
                  activeOpacity={0.7}
                >
                  <Ionicons name={showNewPassword ? "eye-off" : "eye"} size={24} color="#7f7f7f" />
                </TouchableOpacity>
              </View>

              {/* Requisitos de contraseña */}
              {passwordTouched && (
                <View style={styles.requirementsContainer}>
                  <Text style={styles.requirementsTitle}>La contraseña debe tener:</Text>
                  <PasswordRequirement label="Al menos 8 caracteres" isMet={hasMinLength} />
                  <PasswordRequirement label="Al menos una letra mayúscula" isMet={hasUpperCase} />
                  <PasswordRequirement label="Al menos una letra minúscula" isMet={hasLowerCase} />
                  <PasswordRequirement label="Al menos un número" isMet={hasNumber} />
                  <PasswordRequirement label="Al menos un carácter especial" isMet={hasSpecialChar} />
                </View>
              )}

              {/* Confirmar nueva contraseña */}
              <Text style={styles.inputLabel}>Confirmar nueva contraseña</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputWithIcon}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder=""
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => togglePasswordVisibility("confirm")}
                  activeOpacity={0.7}
                >
                  <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={24} color="#7f7f7f" />
                </TouchableOpacity>
              </View>

              {/* Mensaje de error si las contraseñas no coinciden - solo se muestra después de enviar el formulario */}
              {formSubmitted && confirmPassword.length > 0 && !passwordsMatch && (
                <Text style={styles.errorText}>Las contraseñas no coinciden</Text>
              )}

              {/* Botón de actualizar */}
              <TouchableOpacity
                style={[styles.updateButton, (!allFieldsFilled || isLoading) && styles.disabledButton]}
                onPress={handleUpdatePassword}
                disabled={!allFieldsFilled || isLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.updateButtonText}>{isLoading ? "Actualizando..." : "Actualizar contraseña"}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Modal de éxito */}
        <SuccessModal visible={successModalVisible} onClose={handleSuccessModalClose} />

        {/* Modal de error */}
        <ErrorModal visible={errorModalVisible} message={errorMessage} onClose={handleErrorModalClose} />
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  backButton: {
    marginTop: 20,
    marginBottom: 20,
    width: 40,
    height: 40,
  },
  backButtonImage: {
    width: 40,
    height: 40,
  },
  headerContainer: {
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
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2262ce",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: "#595959",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 10,
  },
  inputWithIcon: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  helperText: {
    fontSize: 14,
    color: "#7f7f7f",
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: "#59cdf2",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#a8e2f9",
  },
  updateButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Estilos para requisitos de contraseña
  requirementsContainer: {
    marginBottom: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 15,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#595959",
    marginBottom: 10,
  },
  requirementContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  requirementDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  requirementMet: {
    backgroundColor: "#4CAF50",
  },
  requirementNotMet: {
    backgroundColor: "#E0E0E0",
  },
  requirementDotText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  requirementText: {
    fontSize: 14,
  },
  requirementTextMet: {
    color: "#4CAF50",
  },
  requirementTextNotMet: {
    color: "#7f7f7f",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginBottom: 15,
    marginTop: -5,
  },
  // Estilos para el modal de éxito
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContent: {
    padding: 25,
    alignItems: "center",
  },
  successCircleContainer: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  successCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#59cdf2",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
  errorCircleContainer: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  errorCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
  },
  errorIcon: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3f3f3f",
    marginBottom: 10,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    color: "#7f7f7f",
    marginBottom: 25,
    textAlign: "center",
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: "#59cdf2",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 10,
  },
})

export default SecurityScreen
