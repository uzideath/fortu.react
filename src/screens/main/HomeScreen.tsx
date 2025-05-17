"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
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
  Dimensions,
} from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import type { MainScreenProps } from "src/types"
import { colors } from "src/styles/colors"
import { formatCurrency } from "src/utils/helpers"
import { api } from "src/services/api"
import Ionicons from "react-native-vector-icons/Ionicons"
import { getSelectedAvatar, avatarEvents, type AvatarInfo } from "src/services/avatarService"
import { getUserData, userDataEvents, type UserData } from "src/services/userDataService"

type HomeScreenProps = MainScreenProps<"Home">

const { width, height } = Dimensions.get("window")

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [balance, setBalance] = useState<string>("0")
  const [userName, setUserName] = useState<string>("Cargando...")
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [avatarSource, setAvatarSource] = useState<any>(require("src/assets/images/profile_placeholder.jpg"))

  // Función para actualizar el avatar
  const updateAvatar = useCallback(async () => {
    try {
      const selectedAvatar = await getSelectedAvatar()
      if (selectedAvatar) {
        setAvatarSource(selectedAvatar.source)
      }
    } catch (error) {
      console.error("Error updating avatar:", error)
      // Usar la imagen proporcionada como avatar predeterminado en caso de error
      setAvatarSource(require("src/assets/images/profile_placeholder.jpg"))
    }
  }, [])

  // Función para actualizar los datos del usuario
  const updateUserData = useCallback(async () => {
    try {
      const userData = await getUserData()
      setBalance(userData.balance)
      setUserName(userData.name)
    } catch (error) {
      console.error("Error updating user data:", error)
    }
  }, [])

  // Escuchar cambios en el avatar
  useEffect(() => {
    // Suscribirse al evento de cambio de avatar
    const handleAvatarChange = (avatar: AvatarInfo) => {
      setAvatarSource(avatar.source)
    }

    avatarEvents.on("avatarChanged", handleAvatarChange)

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      avatarEvents.off("avatarChanged", handleAvatarChange)
    }
  }, [])

  // Escuchar cambios en los datos del usuario
  useEffect(() => {
    // Suscribirse al evento de cambio de datos del usuario
    const handleUserDataChange = (userData: UserData) => {
      setBalance(userData.balance)
      setUserName(userData.name)
    }

    userDataEvents.on("userDataChanged", handleUserDataChange)

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      userDataEvents.off("userDataChanged", handleUserDataChange)
    }
  }, [])

  // Función para cargar los datos
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      // Obtener datos del usuario
      await updateUserData()

      // Obtener métodos de pago
      const methods = await api.getPaymentMethods()
      console.log("Métodos de pago obtenidos:", JSON.stringify(methods, null, 2))

      // Verificar el tipo de tarjeta del método predeterminado
      if (methods.length > 0 && methods[0].isDefault) {
        console.log("Tipo de tarjeta del método predeterminado:", methods[0].type)
      }

      setPaymentMethods(methods)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [updateUserData])

  // Cargar datos al montar el componente
  useEffect(() => {
    updateAvatar() // Actualizar avatar inmediatamente
    fetchData() // Cargar otros datos de forma asíncrona
  }, [updateAvatar, fetchData])

  // Recargar datos cada vez que la pantalla vuelve a estar en foco
  useFocusEffect(
    useCallback(() => {
      console.log("HomeScreen en foco, actualizando datos...")
      updateAvatar() // Actualizar avatar inmediatamente
      fetchData() // Cargar otros datos de forma asíncrona
      return () => {
        // Cleanup opcional
      }
    }, [updateAvatar, fetchData]),
  )

  const handleMenuPress = () => {
    navigation.navigate("Menu")
  }

  const handleAddPaymentMethod = () => {
    navigation.navigate("AddPaymentMethod")
  }

  const handleLoadPaymentMethod = () => {
    navigation.navigate("LoadPaymentMethod")
  }

  const handleTicketsPress = () => {
    // Navegar a la pantalla de movimientos
    navigation.navigate("Movements")
  }

  const handleWithdrawPress = () => {
    // Implementar la funcionalidad de retirar dinero
    console.log("Retirar dinero")
  }

  const handleBackPress = () => {
    // Volver a la pantalla anterior
    navigation.goBack()
  }

  // Modificar la función getCardLogo para simplificarla y hacerla más robusta
  const getCardLogo = (type: string | undefined) => {
    console.log("HomeScreen: Obteniendo logo para tipo:", type)

    if (!type) {
      console.log("HomeScreen: Tipo no definido, usando logo por defecto (mastercard)")
      return require("src/assets/images/mastercard_logo.png")
    }

    // Convertir a minúsculas y eliminar espacios para comparación más segura
    const cardType = type.toLowerCase().trim()
    console.log("HomeScreen: Tipo de tarjeta normalizado:", cardType)

    if (cardType === "visa") {
      console.log("HomeScreen: Usando logo de Visa")
      return require("src/assets/images/visa_logo.png")
    } else if (cardType === "mastercard") {
      console.log("HomeScreen: Usando logo de Mastercard")
      return require("src/assets/images/mastercard_logo.png")
    } else if (cardType === "amex") {
      console.log("HomeScreen: Usando logo de American Express")
      return require("src/assets/images/amex_logo.png")
    } else if (cardType === "wompi") {
      console.log("HomeScreen: Usando logo de Wompi")
      return require("src/assets/images/wompi_logo.png")
    } else if (cardType === "nequi") {
      console.log("HomeScreen: Usando logo de Nequi")
      return require("src/assets/images/nequi_logo_new.png")
    } else {
      console.log("HomeScreen: Tipo desconocido:", cardType, "usando logo por defecto (mastercard)")
      return require("src/assets/images/mastercard_logo.png")
    }
  }

  // Modificar renderCardContent para simplificarlo y hacerlo más directo
  const renderCardContent = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyPaymentCard}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      )
    }

    // Verificar si hay un método de pago predeterminado
    const defaultMethod = paymentMethods.find((method) => method.isDefault)
    console.log(
      "HomeScreen: Método de pago predeterminado:",
      defaultMethod ? JSON.stringify(defaultMethod, null, 2) : "No hay método predeterminado",
    )

    if (!defaultMethod) {
      return (
        <TouchableOpacity style={styles.emptyPaymentCard} onPress={handleAddPaymentMethod}>
          <View style={styles.addPaymentContainer}>
            <Text style={styles.plusIcon}>+</Text>
            <Text style={styles.addPaymentText}>Agregar método de pago</Text>
          </View>
        </TouchableOpacity>
      )
    }

    // Mostrar el método de pago predeterminado
    const cardLogo = getCardLogo(defaultMethod.type)

    // Colores para diferentes tipos de tarjetas
    let backgroundColor = colors.primary // Azul por defecto
    let textColor = colors.white // Blanco por defecto
    let needsBorder = false

    // Verificar explícitamente el tipo de tarjeta
    if (defaultMethod.type) {
      const cardType = defaultMethod.type.toLowerCase().trim()
      console.log("HomeScreen: Tipo de tarjeta detectado:", cardType)

      if (cardType === "visa") {
        backgroundColor = "#1A1F71" // Azul oscuro de Visa
        textColor = colors.white
        console.log("HomeScreen: Aplicando estilo para Visa")
      } else if (cardType === "mastercard") {
        backgroundColor = "#F8F8F8" // Gris muy claro para Mastercard
        textColor = "#000000" // Texto negro para contraste
        needsBorder = true
        console.log("HomeScreen: Aplicando estilo para Mastercard")
      } else if (cardType === "amex") {
        backgroundColor = "#F2F3F5" // Blanco hueso para Amex
        textColor = "#006FCF" // Azul de Amex para el texto
        needsBorder = true
        console.log("HomeScreen: Aplicando estilo para Amex")
      } else if (cardType === "wompi") {
        backgroundColor = "#FFFFFF" // Fondo blanco para Wompi
        textColor = colors.text.primary // Texto oscuro
        needsBorder = true
        console.log("HomeScreen: Aplicando estilo para Wompi")
      } else if (cardType === "nequi") {
        backgroundColor = "#FFFFFF" // Blanco para Nequi
        textColor = "#FF2F73" // Rosa de Nequi para el texto
        needsBorder = true
        console.log("HomeScreen: Aplicando estilo para Nequi")
      }
    }

    console.log("HomeScreen: Renderizando tarjeta con color de fondo:", backgroundColor)
    console.log("HomeScreen: Renderizando tarjeta con color de texto:", textColor)

    return (
      <TouchableOpacity
        style={[styles.paymentCard, { backgroundColor }, needsBorder && styles.lightCardBorder]}
        onPress={handleAddPaymentMethod}
      >
        {defaultMethod.type === "wompi" || defaultMethod.type === "nequi" ? (
          // Para Wompi y Nequi, mostrar solo el logo centrado
          <View style={styles.centeredLogoContainer}>
            <Image source={cardLogo} style={styles.centeredLogo} resizeMode="contain" />
          </View>
        ) : (
          // Para tarjetas, mantener el diseño original
          <>
            <View style={styles.visaLogoContainer}>
              <Image source={cardLogo} style={styles.visaLogo} resizeMode="contain" />
            </View>
            <View style={styles.cardNumberContainer}>
              <Text style={[styles.cardNumber, { color: textColor }]}>*** ***** {defaultMethod.number || "6032"}</Text>
            </View>
          </>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <ImageBackground
          source={require("src/assets/images/Fondo6_FORTU.png")}
          style={styles.background}
          resizeMode="cover"
        >
          {/* Sección superior: Saldo y perfil */}
          <View style={styles.topSection}>
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>Saldo</Text>
              <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
            </View>

            <View style={styles.profileContainer}>
              <View style={styles.profileTextContainer}>
                <Text style={styles.profileLabel}>Nombre</Text>
                <Text style={styles.profileLabel}>de usuario</Text>
              </View>
              <View style={styles.profileImageContainer}>
                <Image source={avatarSource} style={styles.profileImage} />
              </View>
            </View>
          </View>

          {/* Sección de iconos de acción */}
          <View style={styles.actionsSection}>
            <TouchableOpacity style={styles.actionButton} onPress={handleMenuPress}>
              <Image
                source={require("src/assets/images/Menu.png")}
                style={styles.actionIconImage}
                resizeMode="contain"
              />
              <Text style={styles.actionText}>Menu</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleLoadPaymentMethod}>
              <Image
                source={require("src/assets/images/Cargar.png")}
                style={styles.actionIconImage}
                resizeMode="contain"
              />
              <Text style={styles.actionText}>Cargar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleWithdrawPress}>
              <Image
                source={require("src/assets/images/Retirar.png")}
                style={styles.actionIconImage}
                resizeMode="contain"
              />
              <Text style={styles.actionText}>Retirar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleTicketsPress}>
              <Image
                source={require("src/assets/images/Tiquetes.png")}
                style={styles.actionIconImage}
                resizeMode="contain"
              />
              <Text style={styles.actionText}>Tiquetes</Text>
            </TouchableOpacity>
          </View>

          {/* Contenedor blanco para el resto del contenido */}
          <View style={styles.whiteContainer}>
            {/* Sección de métodos de pago */}
            <View style={styles.paymentSectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Medios de pago</Text>
                <TouchableOpacity style={styles.addButton} onPress={handleAddPaymentMethod}>
                  <Text style={styles.addButtonText}>+ Agregar</Text>
                </TouchableOpacity>
              </View>

              {/* Contenedor de la tarjeta con padding */}
              <View style={styles.cardOuterContainer}>{renderCardContent()}</View>
            </View>

            {/* Botón de regresar */}
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Ionicons name="arrow-back" size={24} color={colors.white} />
              <Text style={styles.backButtonText}>Regresar</Text>
            </TouchableOpacity>

            {/* Sección de novedades */}
            <View style={styles.newsSectionContainer}>
              <Text style={styles.sectionTitle}>Novedades</Text>

              {/* Primera tarjeta de noticias */}
              <TouchableOpacity style={styles.newsCard}>
                <View style={styles.newsImageContainer}>
                  <Image source={require("src/assets/images/news_image1.png")} style={styles.newsImage} />
                </View>
                <View style={styles.newsContent}>
                  <Text style={styles.newsText}>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                    laoreet dolore magna aliquam erat volutpat.
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Segunda tarjeta de noticias */}
              <TouchableOpacity style={[styles.newsCard, styles.lastNewsCard]}>
                <View style={styles.newsImageContainer}>
                  <Image source={require("src/assets/images/news_image2.png")} style={styles.newsImage} />
                </View>
                <View style={styles.newsContent}>
                  <Text style={styles.newsText}>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                    laoreet dolore magna aliquam erat volutpat. Ut wisi
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Espacio adicional al final */}
              <View style={styles.bottomSpace} />
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  background: {
    width: "100%",
    minHeight: height, // Asegura que la imagen tenga al menos la altura de la pantalla
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    marginBottom: 65, // Aumentado de 50 a 65 para un poco más de separación
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
  profileTextContainer: {
    alignItems: "flex-end",
    marginRight: 10,
  },
  profileLabel: {
    fontSize: 16,
    color: colors.white,
    textAlign: "right",
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
    paddingBottom: 0, // Eliminado el padding inferior
  },
  paymentSectionContainer: {
    backgroundColor: colors.white,
    borderRadius: 20,
    margin: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  addButton: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },
  cardOuterContainer: {
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 5,
  },
  paymentCard: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    height: 180,
    padding: 25,
    justifyContent: "space-between",
  },
  lightCardBorder: {
    borderWidth: 1,
    borderColor: "#D0D0C8", // Un gris muy claro para el borde
  },
  emptyPaymentCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    height: 180,
    padding: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
  },
  addPaymentContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  plusIcon: {
    fontSize: 60,
    color: colors.primary,
    marginBottom: 10,
  },
  addPaymentText: {
    fontSize: 18,
    color: colors.primary,
    textAlign: "center",
    fontWeight: "bold",
  },
  loadingText: {
    fontSize: 18,
    color: colors.text.secondary,
  },
  visaLogoContainer: {
    alignItems: "flex-end",
  },
  visaLogo: {
    width: 80,
    height: 40,
  },
  cardNumberContainer: {
    marginTop: "auto",
  },
  cardNumber: {
    fontSize: 18,
    color: colors.white,
    fontWeight: "bold",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  newsSectionContainer: {
    paddingHorizontal: 25,
    marginTop: 10,
    paddingBottom: 0, // Eliminado el padding inferior
  },
  newsCard: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    marginTop: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lastNewsCard: {
    marginBottom: 10, // Margen normal para la última tarjeta
  },
  bottomSpace: {
    height: 20, // Espacio adicional al final
  },
  newsImageContainer: {
    width: 80,
    height: 80,
    marginRight: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  newsImage: {
    width: "100%",
    height: "100%",
  },
  newsContent: {
    flex: 1,
  },
  newsText: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
  centeredLogoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredLogo: {
    width: 150,
    height: 80,
  },
})

export default HomeScreen
