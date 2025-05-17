"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ImageBackground,
  Keyboard,
  Dimensions,
  StatusBar,
} from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "@/types"
import LoginErrorModal from "@/components/modals/LoginErrorModal"
import { colors } from "@/styles/colors"
import Ionicons from "react-native-vector-icons/Ionicons"

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp
}

const { width, height } = Dimensions.get("window")

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showLoginErrorModal, setShowLoginErrorModal] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("¡Ups! Esa no es tu clave")
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const scrollViewRef = useRef<ScrollView>(null)
  const usernameInputRef = useRef<TextInput>(null)
  const passwordInputRef = useRef<TextInput>(null)

  // Detectar cuando el teclado se muestra/oculta
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      // Desplazar el ScrollView para mostrar los inputs cuando aparece el teclado
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 100)
    })

    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      // Volver a la posición original cuando se oculta el teclado
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true })
      }, 100)
    })

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  // Función para manejar el cambio de texto en el campo de usuario
  const handleUsernameChange = (text: string) => {
    setUsername(text)
  }

  // Función para manejar el cambio de texto en el campo de contraseña
  const handlePasswordChange = (text: string) => {
    setPassword(text)
  }

  const handleForgotPassword = (): void => {
    navigation.navigate("ForgotPassword")
  }

  const handleLogin = (): void => {
    // Para pruebas, permitir cualquier entrada
    if (username.trim() === "" && password.trim() === "") {
      // Si ambos están vacíos, navegar directamente
      navigation.navigate("MainApp")
      return
    }

    // Validación básica
    if (!username.trim()) {
      setErrorMessage("Por favor, ingresa tu nombre de usuario.")
      setShowLoginErrorModal(true)
      return
    }

    if (!password.trim()) {
      setErrorMessage("Por favor, ingresa tu contraseña.")
      setShowLoginErrorModal(true)
      return
    }

    // Simulación de credenciales incorrectas para demostración
    // En una implementación real, esto vendría de la verificación con el backend
    if (username !== "usuario1" || password !== "clave123") {
      setErrorMessage("¡Ups! Esa no es tu clave")
      setShowLoginErrorModal(true)
      return
    }

    // Navegar a la pantalla principal
    navigation.navigate("MainApp")
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

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword)
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
                {/* Logo centrado encima del contenedor de login */}
                <View style={styles.logoContainer}>
                  <Image source={require("@/assets/images/Logo_FORTU.png")} style={styles.logo} resizeMode="contain" />
                </View>

                <View style={styles.formContainer}>
                  <Text style={styles.loginText}>Iniciar sesión</Text>

                  <View style={styles.inputContainer}>
                    <View style={styles.iconContainer}>
                      <Image
                        source={require("@/assets/images/Group.png")}
                        style={styles.inputIconImage}
                        resizeMode="contain"
                      />
                    </View>
                    {/* Usamos un contenedor para centrar el input y su contenido */}
                    <View style={styles.textInputWrapper}>
                      <TextInput
                        ref={usernameInputRef}
                        style={[styles.input, { textAlign: "center" }]}
                        placeholder="Usuario"
                        placeholderTextColor="#B0C8EA"
                        value={username}
                        onChangeText={handleUsernameChange}
                        autoCapitalize="none"
                        // Eliminamos cualquier manipulación del cursor
                      />
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <View style={styles.iconContainer}>
                      <Image
                        source={require("@/assets/images/Vector.png")}
                        style={styles.inputIconImage}
                        resizeMode="contain"
                      />
                    </View>
                    {/* Usamos un contenedor para centrar el input y su contenido */}
                    <View style={styles.textInputWrapper}>
                      <TextInput
                        ref={passwordInputRef}
                        style={[styles.input, { textAlign: "center" }]}
                        placeholder="Contraseña"
                        placeholderTextColor="#B0C8EA"
                        value={password}
                        onChangeText={handlePasswordChange}
                        secureTextEntry={!showPassword}
                        // Eliminamos cualquier manipulación del cursor
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.eyeIconContainer}
                      onPress={togglePasswordVisibility}
                      activeOpacity={0.7}
                    >
                      <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#B0C8EA" />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
                    <Text style={styles.forgotPasswordText}>¿Olvidó su clave?</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.7}>
                    <Text style={styles.loginButtonText}>Ingresar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
                    <Image
                      source={require("@/assets/images/google_logo.jpg")}
                      style={styles.socialLogo}
                      resizeMode="contain"
                    />
                    <Text style={styles.socialButtonText}>Continuar con google</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.socialButton} onPress={handleAppleLogin}>
                    <Image
                      source={require("@/assets/images/apple_logo.png")}
                      style={styles.socialLogo}
                      resizeMode="contain"
                    />
                    <Text style={styles.socialButtonText}>Continuar AppleID</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>Crear una cuenta</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>

      <LoginErrorModal
        visible={showLoginErrorModal}
        onClose={() => setShowLoginErrorModal(false)}
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
    justifyContent: "flex-end", // Asegura que el contenido esté en la parte inferior
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "flex-end", // Asegura que el contenido esté en la parte inferior
  },
  contentContainer: {
    width: "100%",
  },
  logoContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 180,
    height: 70,
  },
  formContainer: {
    backgroundColor: colors.white,
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
    paddingBottom: Platform.OS === "ios" ? 30 : 20, // Añadir padding extra en iOS para el notch
  },
  loginText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 30,
    marginBottom: 10,
    paddingHorizontal: 15,
    height: 45,
    position: "relative",
  },
  iconContainer: {
    marginRight: 10,
    width: 20,
  },
  inputIconImage: {
    width: 20,
    height: 20,
    tintColor: "#B0C8EA",
  },
  textInputWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 40,
    fontSize: 16,
    color: colors.text.primary,
  },
  eyeIconContainer: {
    position: "absolute",
    right: 15,
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  forgotPasswordButton: {
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    padding: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 30,
    padding: 10,
    marginBottom: 8,
    height: 42,
  },
  socialLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  socialButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    textAlign: "center",
  },
  registerButton: {
    alignSelf: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
})

export default LoginScreen
