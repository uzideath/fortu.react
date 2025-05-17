"use client"

import type React from "react"
import { useEffect } from "react"
import { View, StyleSheet, SafeAreaView, Image, ImageBackground } from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "@/types"
import ColoredLoadingWheel from "@/components/common/ColoredLoadingWheel"

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, "Splash">

interface SplashScreenProps {
  navigation: SplashScreenNavigationProp
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    // Simulación de carga inicial
    const timer = setTimeout(() => {
      // Navegar a la pantalla de login después de 2 segundos
      navigation.replace("Login")
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
