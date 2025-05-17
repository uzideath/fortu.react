import React, { useState, useRef } from "react"
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  StatusBar,
  Dimensions,
} from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "@/types"
import { loginService } from "@/services/auth"
import LoginErrorModal from "@/components/modals/LoginErrorModal"
import Logo from "@/components/auth/login/Logo"
import LoginForm from "@/components/auth/login/Form"
import SocialButtons from "@/components/auth/login/SocialButtonts"
import RegisterPrompt from "@/components/auth/login/RegisterPrompt"

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [showLoginErrorModal, setShowLoginErrorModal] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("¡Ups! Esa no es tu clave")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  const scrollViewRef = useRef<ScrollView>(null)

  const handleForgotPassword = (): void => {
    navigation.navigate("ForgotPassword")
  }

  const handleLogin = async (email: string, password: string): Promise<void> => {
    // Validation
    if (!email.trim()) {
      setErrorMessage("Por favor, ingresa tu correo electrónico.")
      setShowLoginErrorModal(true)
      return
    }

    if (!password.trim()) {
      setErrorMessage("Por favor, ingresa tu contraseña.")
      setShowLoginErrorModal(true)
      return
    }

    setIsLoading(true)
    
    try {
      // Use the provided login service
      const user = await loginService(email, password)
      console.log("Login successful:", user)
      
      // Navigate to main app on success
      navigation.navigate("MainApp")
    } catch (error) {
      console.error("Login error:", error)
      
      // Show appropriate error message
      setErrorMessage("Credenciales incorrectas. Por favor, verifica tu correo y contraseña.")
      setShowLoginErrorModal(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = (): void => {
    navigation.navigate("Register")
  }

  const handleGoogleLogin = (): void => {
    // Implementación futura de login con Google
    console.log("Login con Google")
  }

  const handleAppleLogin = (): void => {
    // Implementación futura de login con Apple
    console.log("Login con Apple")
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ImageBackground
        source={require("@/assets/images/Fondo2_FORTU.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
            style={styles.keyboardAvoidingView}
          >
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={styles.scrollView}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.contentContainer}>
                <Logo />

                <View style={styles.formContainer}>
                  <LoginForm 
                    onLogin={handleLogin}
                    onForgotPassword={handleForgotPassword}
                    isLoading={isLoading}
                  />

                  <SocialButtons 
                    onGooglePress={handleGoogleLogin}
                    onApplePress={handleAppleLogin}
                  />

                  <RegisterPrompt onRegisterPress={handleRegister} />
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>

      <LoginErrorModal
        visible={showLoginErrorModal}
        onClose={() => setShowLoginErrorModal(true)}
        message={errorMessage}
      />
    </View>
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
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  contentContainer: {
    width: "100%",
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
  },
})

export default LoginScreen