"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  ImageBackground,
  StatusBar,
  Alert,
} from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { MainStackParamList } from "../../types"
import { colors } from "../../styles/colors"
import { formatCurrency } from "../../utils/helpers"
import { authService } from "../../services/auth"

type MenuScreenNavigationProp = StackNavigationProp<MainStackParamList, "Menu">

interface MenuScreenProps {
  navigation: MenuScreenNavigationProp
}

const MenuScreen: React.FC<MenuScreenProps> = ({ navigation }) => {
  const [balance, setBalance] = useState<string>("87600")
  const [userName, setUserName] = useState<string>("Nombre de usuario")

  useEffect(() => {
    // Obtener datos del usuario
    const fetchUserData = async () => {
      try {
        const user = await authService.getCurrentUser()
        if (user) {
          setUserName(user.name)
          setBalance(user.balance)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserData()
  }, [])

  const handlePaymentMethodsPress = (): void => {
    navigation.navigate("PaymentSection")
  }

  const handleHomePress = (): void => {
    navigation.navigate("Home")
  }

  // Añadir la función handleSettingsPress con logs para depuración
  const handleSettingsPress = (): void => {
    console.log("Navegando a Settings...")
    try {
      navigation.navigate("Settings")
      console.log("Navegación a Settings completada")
    } catch (error) {
      console.error("Error al navegar a Settings:", error)
      Alert.alert("Error de navegación", "No se pudo navegar a la pantalla de Ajustes.")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <ImageBackground
        source={require("../../assets/images/Fondo6_FORTU.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          {/* Sección superior: Saldo y perfil */}
          <View style={styles.topSection}>
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>Saldo</Text>
              <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
            </View>

            <View style={styles.profileContainer}>
              <Text style={styles.profileLabel}>{userName}</Text>
              <View style={styles.profileImageContainer}>
                <Image source={require("../../assets/images/profile_placeholder.jpg")} style={styles.profileImage} />
              </View>
            </View>
          </View>

          {/* Sección de iconos de acción */}
          <View style={styles.actionsSection}>
            <TouchableOpacity style={styles.actionButton} onPress={handleHomePress}>
              <Image
                source={require("../../assets/images/Menu.png")}
                style={styles.actionIconImage}
                resizeMode="contain"
              />
              <Text style={styles.actionText}>Menu</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Image
                source={require("../../assets/images/Cargar.png")}
                style={styles.actionIconImage}
                resizeMode="contain"
              />
              <Text style={styles.actionText}>Cargar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Image
                source={require("../../assets/images/Retirar.png")}
                style={styles.actionIconImage}
                resizeMode="contain"
              />
              <Text style={styles.actionText}>Retirar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Image
                source={require("../../assets/images/Tiquetes.png")}
                style={styles.actionIconImage}
                resizeMode="contain"
              />
              <Text style={styles.actionText}>Tiquetes</Text>
            </TouchableOpacity>
          </View>

          {/* Contenedor blanco para el resto del contenido */}
          <View style={styles.whiteContainer}>
            {/* Opciones de menú */}
            <View style={styles.menuOptionsContainer}>
              <TouchableOpacity style={styles.menuOption}>
                <View style={styles.menuOptionContent}>
                  <View style={styles.menuOptionIconContainer}>
                    <Image
                      source={require("../../assets/images/wallet_icon.png")}
                      style={styles.menuOptionIcon}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.menuOptionText}>Billetera</Text>
                </View>
                <Image
                  source={require("../../assets/images/arrow_right.png")}
                  style={styles.menuOptionArrow}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuOption} onPress={handlePaymentMethodsPress}>
                <View style={styles.menuOptionContent}>
                  <View style={styles.menuOptionIconContainer}>
                    <Image
                      source={require("../../assets/images/payment_icon.png")}
                      style={styles.menuOptionIcon}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.menuOptionText}>Medios de pago</Text>
                </View>
                <Image
                  source={require("../../assets/images/arrow_right.png")}
                  style={styles.menuOptionArrow}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/* Modificar el TouchableOpacity para el botón de Ajustes */}
              <TouchableOpacity style={styles.menuOption} onPress={handleSettingsPress}>
                <View style={styles.menuOptionContent}>
                  <View style={styles.menuOptionIconContainer}>
                    <Image
                      source={require("../../assets/images/settings_icon.png")}
                      style={styles.menuOptionIcon}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.menuOptionText}>Ajustes</Text>
                </View>
                <Image
                  source={require("../../assets/images/arrow_right.png")}
                  style={styles.menuOptionArrow}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            {/* Banner promocional */}
            <View style={styles.bannerContainer}>
              <Image
                source={require("../../assets/images/promo_banner.jpg")}
                style={styles.bannerImage}
                resizeMode="cover"
              />
              <View style={styles.paginationContainer}>
                <View style={[styles.paginationDot, styles.activeDot]} />
                <View style={styles.paginationDot} />
                <View style={styles.paginationDot} />
                <View style={styles.paginationDot} />
              </View>
            </View>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingTop: 20,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    marginBottom: 65,
  },
  balanceContainer: {
    alignItems: "flex-start",
  },
  balanceLabel: {
    fontSize: 18,
    color: colors.white,
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.white,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileLabel: {
    fontSize: 16,
    color: colors.white,
    textAlign: "right",
    marginRight: 10,
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.white,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  actionsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  actionButton: {
    alignItems: "center",
  },
  actionIconImage: {
    width: 35,
    height: 35,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: colors.white,
  },
  whiteContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  menuOptionsContainer: {
    marginBottom: 30,
  },
  menuOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuOptionIconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuOptionIcon: {
    width: 30,
    height: 30,
    tintColor: "#2262ce",
  },
  menuOptionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3f3f3f",
  },
  menuOptionArrow: {
    width: 40,
    height: 40,
  },
  bannerContainer: {
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
  },
  bannerImage: {
    width: "100%",
    height: 220, // Aumentado de 180 a 220 para mayor altura
    borderRadius: 15,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.white,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
})

export default MenuScreen