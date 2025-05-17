"use client"

import type React from "react"
import { useEffect } from "react"
import { View, StyleSheet, SafeAreaView, Image, ImageBackground } from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "@/types"
import ColoredLoadingWheel from "@/components/common/ColoredLoadingWheel"
import { isUserRegistered } from "@/services/userDataService"

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, "Splash">

interface SplashScreenProps {
  navigation: SplashScreenNavigationProp
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    // Verificar el estado de autenticación después de un breve retraso
    const checkAuthStatus = async () => {
      try {
        // Verificar si el usuario está registrado
        const isRegistered = await isUserRegistered()

        // Navegar a la pantalla correspondiente
        if (isRegistered) {
          // Si el usuario está registrado, navegar a la pantalla principal
          navigation.navigate("MainApp")
        } else {
          // Si no está registrado, navegar a la pantalla de inicio de sesión
          navigation.navigate("Login")
        }
      } catch (error) {
        console.error("Error al verificar el estado de autenticación:", error)
        // En caso de error, navegar a la pantalla de inicio de sesión
        navigation.navigate("Login")
      }
    }

    // Ejecutar la verificación después de 2 segundos para mostrar la pantalla de splash
    const timer = setTimeout(() => {
      checkAuthStatus()
    }, 2000)

    return () => clearTimeout(timer)
  }, [navigation])

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/Fondo1_FORTU.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <Image source={require("@/assets/images/Logo_FORTU.png")} style={styles.logo} resizeMode="contain" />
          <ColoredLoadingWheel size={50} primaryColor="#FEC937" secondaryColor="#59CDF1" />
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
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 80,
    marginBottom: 50,
  },
})

export default SplashScreen
