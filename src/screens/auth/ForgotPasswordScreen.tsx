"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  StatusBar,
} from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "@/types"
import { colors } from "@/styles/colors"
import EmailErrorModal from "@/components/modals/EmailErrorModal"
import EmailSuccessModal from "@/components/modals/EmailSuccessModal"

type ForgotPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, "ForgotPassword">

interface ForgotPasswordScreenProps {
  navigation: ForgotPasswordScreenNavigationProp
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorModalVisible, setErrorModalVisible] = useState<boolean>(false)
  const [successModalVisible, setSuccessModalVisible] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  // Función para validar el formato del correo electrónico
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSendEmail = () => {
    // Validar que el campo no esté vacío
    if (!email.trim()) {
      setErrorMessage("Por favor, ingresa tu correo electrónico")
      setErrorModalVisible(true)
      return
    }

    // Validar el formato del correo electrónico
    if (!isValidEmail(email.trim())) {
      setErrorMessage("Por favor, ingresa un correo electrónico válido")
      setErrorModalVisible(true)
      return
    }

    setIsLoading(true)

    // Simulación de envío de correo
    setTimeout(() => {
      setIsLoading(false)
      // Mostrar modal de éxito
      setSuccessModalVisible(true)
    }, 1500)
  }

  const handleBackToLogin = () => {
    navigation.navigate("Login")
  }

  const closeErrorModal = () => {
    setErrorModalVisible(false)
  }

  const closeSuccessModal = () => {
    setSuccessModalVisible(false)
    // Redirigir al usuario a la pantalla de inicio de sesión
    navigation.navigate("Login")
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <ImageBackground
        source={require("@/assets/images/Fondo2_FORTU.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Ingresa tu correo electrónico</Text>

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendEmail}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.sendButtonText}>{isLoading ? "Enviando..." : "Enviar"}</Text>
          </TouchableOpacity>

          <View style={styles.rememberContainer}>
            <Text style={styles.rememberText}>¿Recordaste tu contraseña?</Text>
            <TouchableOpacity onPress={handleBackToLogin}>
              <Text style={styles.loginText}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>

        <EmailErrorModal visible={errorModalVisible} onClose={closeErrorModal} message={errorMessage} />
        <EmailSuccessModal visible={successModalVisible} onClose={closeSuccessModal} />
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
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 20,
    color: colors.text.primary,
  },
  sendButton: {
    width: "80%",
    height: 50,
    backgroundColor: "#59cdf2",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  sendButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  rememberContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  rememberText: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },
  loginText: {
    color: "#59cdf2",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default ForgotPasswordScreen
