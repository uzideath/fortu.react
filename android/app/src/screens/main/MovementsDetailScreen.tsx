"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StatusBar,
  Platform,
  Dimensions,
  NativeModules,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import type { MainScreenProps } from "../../types"
import { useFocusEffect } from "@react-navigation/native"
import { getCurrentAvatar } from "../../services/avatarService"

// Función para obtener el nombre del mes actual
const getCurrentMonth = (): string => {
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]
  const currentDate = new Date()
  return months[currentDate.getMonth()]
}

// Definir el tipo para los datos del gráfico
interface ChartDataItem {
  id: string
  name: string
  amount: number
  color: string
}

// Datos de ejemplo para simular compras (en una app real, esto vendría de una API)
const samplePurchases = [
  { id: "p1", type: "lottery", amount: 48000, date: "2025-04-15" },
  { id: "p2", type: "chance", amount: 28000, date: "2025-04-20" },
  { id: "p3", type: "group", amount: 48000, date: "2025-04-25" },
  { id: "p4", type: "international", amount: 15000, date: "2025-04-28" },
]

const { StatusBarManager } = NativeModules
const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBarManager.HEIGHT

const MovementsDetailScreen: React.FC<MainScreenProps<"MovementsDetail">> = ({ navigation }) => {
  const [avatarSource, setAvatarSource] = useState<any>(getCurrentAvatar().source)
  const [statusBarHeight, setStatusBarHeight] = useState(STATUSBAR_HEIGHT)
  const [hasNotchOrIsland, setHasNotchOrIsland] = useState(false)
  const [currentMonth] = useState(getCurrentMonth())
  const [chartData, setChartData] = useState<ChartDataItem[]>([])

  // Función para actualizar los datos del gráfico según el mes actual
  const updateChartData = useCallback(() => {
    // En una app real, aquí se haría una llamada a la API para obtener los datos del mes actual
    // Por ahora, usamos datos de ejemplo

    // Inicializar los datos del gráfico
    const newChartData: ChartDataItem[] = [
      {
        id: "1",
        name: "Loterías en línea",
        amount: 0,
        color: "#2262CE",
      },
      {
        id: "2",
        name: "Chance en línea",
        amount: 0,
        color: "#59CDF2",
      },
      {
        id: "3",
        name: "Sorteos grupales",
        amount: 0,
        color: "#FEC937",
      },
      {
        id: "4",
        name: "Lotería Internacional",
        amount: 0,
        color: "#7CDDB3",
      },
    ]

    // Actualizar los montos según las compras de ejemplo
    samplePurchases.forEach((purchase) => {
      switch (purchase.type) {
        case "lottery":
          newChartData[0].amount += purchase.amount
          break
        case "chance":
          newChartData[1].amount += purchase.amount
          break
        case "group":
          newChartData[2].amount += purchase.amount
          break
        case "international":
          newChartData[3].amount += purchase.amount
          break
      }
    })

    // Actualizar el estado
    setChartData(newChartData)
  }, [])

  // Detectar si el dispositivo tiene notch o isla dinámica
  useEffect(() => {
    if (Platform.OS === "ios") {
      // Verificar si es un iPhone X o posterior (con notch o isla dinámica)
      const { height, width } = Dimensions.get("window")
      const aspectRatio = height / width
      const isIphoneWithNotch = aspectRatio > 2.0
      setHasNotchOrIsland(isIphoneWithNotch)

      // Obtener la altura exacta de la barra de estado
      StatusBarManager.getHeight((statusBarFrameData: { height: number }) => {
        setStatusBarHeight(statusBarFrameData.height)
      })
    }

    // Actualizar los datos del gráfico al cargar la pantalla
    updateChartData()
  }, [updateChartData])

  // Función para actualizar el avatar (sincrónica)
  const updateAvatar = useCallback(() => {
    const currentAvatar = getCurrentAvatar()
    setAvatarSource(currentAvatar.source)
  }, [])

  // Actualizar el avatar cuando la pantalla obtiene el foco
  useFocusEffect(
    useCallback(() => {
      updateAvatar()
      // También actualizar los datos del gráfico cuando la pantalla obtiene el foco
      updateChartData()
      return () => {
        // Cleanup opcional
      }
    }, [updateAvatar, updateChartData]),
  )

  // Calcular el padding superior para el header
  const headerPaddingTop = Platform.OS === "ios" ? (hasNotchOrIsland ? statusBarHeight : 10) : 10

  // Renderizar las tarjetas de categorías
  const renderCategoryCards = () => {
    return chartData.map((item) => {
      // Formatear el monto para mostrar
      const formattedAmount = item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

      return (
        <View key={item.id} style={styles.categoryCard}>
          <View style={styles.categoryLeft}>
            <View style={[styles.categoryDot, { backgroundColor: item.color }]} />
            <Text style={styles.categoryName}>{item.name}</Text>
          </View>
          <Text style={styles.categoryAmount}>${formattedAmount}</Text>
        </View>
      )
    })
  }

  // Implementación del gráfico circular
  const renderCircularDonutChart = () => {
    const totalValue = chartData.reduce((sum, item) => sum + item.amount, 0)
    const formattedTotal = totalValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

    return (
      <View style={styles.circularDonutContainer}>
        {/* Anillo exterior gris */}
        <View style={styles.circularDonutRing} />

        {/* Círculo interior blanco con el valor total */}
        <View style={styles.circularDonutHole}>
          <Text style={styles.circularDonutText}>${formattedTotal}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#2262CE" translucent={true} />
      <ImageBackground source={require("../../assets/images/Fondo13_FORTU.png")} style={styles.background}>
        <SafeAreaView style={styles.safeArea} edges={["right", "left"]}>
          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header modificado para que coincida con MovementsScreen */}
            <View style={[styles.header, { paddingTop: headerPaddingTop }]}>
              <View style={styles.headerLeft}>
                <TouchableOpacity onPress={() => navigation.navigate("Menu")} style={styles.backButton}>
                  <Image source={require("../../assets/images/Menu.png")} style={styles.backIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.notificationButton}>
                  <Image
                    source={require("../../assets/images/campana.png")}
                    style={styles.notificationIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sección de perfil sin saldo */}
            <View style={styles.profileSection}>
              <TouchableOpacity style={styles.profileImageContainer} onPress={() => navigation.navigate("UserInfo")}>
                <Image source={avatarSource} style={styles.profileImage} resizeMode="cover" />
              </TouchableOpacity>
            </View>

            <View style={styles.periodSection}>
              <Text style={styles.periodLabel}>Periodo</Text>
              <Text style={styles.periodValue}>{currentMonth}</Text>
            </View>

            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Tickets</Text>
              <View style={styles.donutChartWrapper}>
                {/* Gráfico circular */}
                {renderCircularDonutChart()}
              </View>

              {/* Tarjetas de categorías */}
              <View style={styles.categoriesContainer}>{renderCategoryCards()}</View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#2262CE",
  },
  background: {
    flex: 1,
    width: "100%",
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 5,
    marginRight: 15,
  },
  backIcon: {
    width: 30,
    height: 30,
    marginTop: 5,
  },
  notificationButton: {
    padding: 5,
  },
  notificationIcon: {
    width: 30,
    height: 30,
    marginTop: 5,
  },
  profileSection: {
    alignItems: "flex-end",
    marginBottom: 25,
    marginTop: -15,
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  periodSection: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  periodLabel: {
    color: "#FFFFFF",
    fontSize: 18,
    marginBottom: 5,
  },
  periodValue: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "bold",
  },
  chartContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 30,
    paddingBottom: 50,
  },
  chartTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 20,
  },
  donutChartWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  // Estilos para el gráfico circular
  circularDonutContainer: {
    width: 220,
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  circularDonutRing: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 30,
    borderColor: "#F5F5F5",
  },
  circularDonutHole: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  circularDonutText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
  },
  categoriesContainer: {
    marginTop: 10,
  },
  categoryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 15,
  },
  categoryName: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "500",
  },
  categoryAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
})

export default MovementsDetailScreen
