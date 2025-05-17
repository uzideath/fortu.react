"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Platform,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useFocusEffect } from "@react-navigation/native"
import type { MainScreenProps } from "src/types"
import { getSelectedAvatar, avatarEvents, type AvatarInfo } from "src/services/avatarService"
import { getUserData, userDataEvents, type UserData } from "src/services/userDataService"
import { statisticsService, statisticsEvents, type CategoryData, type Statistics } from "src/services/statisticsService"
import Svg, { Circle, Path, G } from "react-native-svg"

const { width, height } = Dimensions.get("window")

const StatisticsScreen: React.FC<MainScreenProps<"Statistics">> = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const [avatarSource, setAvatarSource] = useState<any>(null)
  const [userName, setUserName] = useState<string>("Usuario")
  const [currentMonth, setCurrentMonth] = useState<string>("")
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Función para actualizar el avatar
  const updateAvatar = useCallback(async () => {
    try {
      const currentAvatar = await getSelectedAvatar()
      if (currentAvatar) {
        setAvatarSource(currentAvatar.source)
      }
    } catch (error) {
      console.error("Error updating avatar:", error)
      setAvatarSource(require("src/assets/images/profile_placeholder.jpg"))
    }
  }, [])

  // Función para actualizar los datos del usuario
  const updateUserData = useCallback(async () => {
    try {
      const userData = await getUserData()
      setUserName(userData.name)
    } catch (error) {
      console.error("Error updating user data:", error)
    }
  }, [])

  // Función para cargar las estadísticas
  const loadStatistics = useCallback(async () => {
    setIsLoading(true)
    try {
      const stats = await statisticsService.getStatistics()
      setCategories(stats.categories)
      setTotalAmount(stats.totalAmount)
      setCurrentMonth(stats.currentMonth)
    } catch (error) {
      console.error("Error loading statistics:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Cargar datos al montar el componente
  useEffect(() => {
    updateAvatar()
    updateUserData()
    loadStatistics()
  }, [updateAvatar, updateUserData, loadStatistics])

  // Actualizar datos cuando la pantalla obtiene el foco
  useFocusEffect(
    useCallback(() => {
      updateAvatar()
      updateUserData()
      loadStatistics()
      return () => {
        // Cleanup opcional
      }
    }, [updateAvatar, updateUserData, loadStatistics]),
  )

  // Escuchar cambios en el avatar
  useEffect(() => {
    const handleAvatarChange = (avatar: AvatarInfo) => {
      setAvatarSource(avatar.source)
    }

    avatarEvents.on("avatarChanged", handleAvatarChange)
    return () => {
      avatarEvents.off("avatarChanged", handleAvatarChange)
    }
  }, [])

  // Escuchar cambios en los datos del usuario
  useEffect(() => {
    const handleUserDataChange = (userData: UserData) => {
      setUserName(userData.name)
    }

    userDataEvents.on("userDataChanged", handleUserDataChange)
    return () => {
      userDataEvents.off("userDataChanged", handleUserDataChange)
    }
  }, [])

  // Escuchar cambios en las estadísticas
  useEffect(() => {
    const handleStatisticsChange = (stats: Statistics) => {
      setCategories(stats.categories)
      setTotalAmount(stats.totalAmount)
      setCurrentMonth(stats.currentMonth)
    }

    statisticsEvents.on("statisticsChanged", handleStatisticsChange)
    return () => {
      statisticsEvents.off("statisticsChanged", handleStatisticsChange)
    }
  }, [])

  // Renderizar el gráfico de donut
  const renderDonutChart = () => {
    const size = 220
    const strokeWidth = 30
    const radius = (size - strokeWidth) / 2
    const center = size / 2

    // Si no hay datos o el total es cero, mostrar un círculo vacío
    if (categories.length === 0 || totalAmount === 0) {
      return (
        <View style={styles.chartContainer}>
          <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
            <Circle cx={center} cy={center} r={radius} fill="#f0f0f0" />
            <Circle cx={center} cy={center} r={radius - strokeWidth} fill="white" />
          </Svg>
          <View style={styles.chartCenterTextContainer}>
            <Text style={styles.chartCenterText}>$0</Text>
          </View>
        </View>
      )
    }

    let startAngle = 0

    // Crear los segmentos del gráfico
    const segments = categories.map((category, index) => {
      // Calcular el ángulo de barrido basado en el monto de la categoría
      const percentage = category.amount / totalAmount
      const sweepAngle = 2 * Math.PI * percentage

      // Si el monto es cero, no renderizar segmento
      if (category.amount === 0) return null

      // Calcular las coordenadas de inicio y fin del arco
      const x1 = center + radius * Math.cos(startAngle)
      const y1 = center + radius * Math.sin(startAngle)
      const x2 = center + radius * Math.cos(startAngle + sweepAngle)
      const y2 = center + radius * Math.sin(startAngle + sweepAngle)

      // Determinar si el arco es mayor que 180 grados
      const largeArcFlag = sweepAngle > Math.PI ? 1 : 0

      // Crear el path del arco
      const path = `
        M ${center} ${center}
        L ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
        L ${center} ${center}
      `

      // Actualizar el ángulo de inicio para el siguiente segmento
      startAngle += sweepAngle

      return <Path key={index} d={path} fill={category.color} />
    })

    return (
      <View style={styles.chartContainer}>
        <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
          <G>
            {segments}
            <Circle cx={center} cy={center} r={radius - strokeWidth} fill="white" />
          </G>
        </Svg>
        <View style={styles.chartCenterTextContainer}>
          <Text style={styles.chartCenterText}>${totalAmount.toLocaleString()}</Text>
        </View>
      </View>
    )
  }

  // Renderizar un ítem de categoría
  const renderCategoryItem = (category: CategoryData, index: number) => {
    return (
      <View key={index} style={styles.categoryItem}>
        <View style={styles.categoryLeftSection}>
          <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
          <Text style={styles.categoryTitle}>{category.title}</Text>
        </View>
        <Text style={styles.categoryAmount}>${category.amount.toLocaleString()}</Text>
      </View>
    )
  }

  return (
    <ImageBackground
      source={require("src/assets/images/Fondo13_FORTU.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="#2262CE" />
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header con campana y perfil */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
              <Image
                source={require("src/assets/images/back_button.png")}
                style={styles.backIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View style={styles.profileContainer}>
              <Text style={styles.profileText}>Nombre{"\n"}de usuario</Text>
              <View style={styles.profileImageContainer}>
                <Image
                  source={avatarSource || require("src/assets/images/profile_placeholder.jpg")}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>

          {/* Sección de período */}
          <View style={styles.periodSection}>
            <Text style={styles.periodLabel}>Periodo</Text>
            <Text style={styles.periodMonth}>{currentMonth}</Text>
          </View>

          {/* Tarjeta de estadísticas */}
          <View style={styles.statsCard}>
            <Text style={styles.statsCardTitle}>Tickets</Text>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2262CE" />
              </View>
            ) : (
              <>
                {/* Gráfico de donut */}
                {renderDonutChart()}

                {/* Lista de categorías */}
                <View style={styles.categoriesList}>
                  {categories.map((category, index) => renderCategoryItem(category, index))}
                </View>
              </>
            )}
          </View>

          {/* Botón de volver */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: Platform.OS === "ios" ? 10 : 40,
    marginBottom: 30,
  },
  iconButton: {
    padding: 5,
  },
  bellIcon: {
    width: 28,
    height: 28,
    tintColor: "white",
  },
  backIcon: {
    width: 40,
    height: 40,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileText: {
    color: "white",
    fontSize: 16,
    textAlign: "right",
    marginRight: 10,
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "white",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  periodSection: {
    marginBottom: 30,
  },
  periodLabel: {
    color: "white",
    fontSize: 18,
  },
  periodMonth: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
  },
  statsCard: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 20,
    marginBottom: 20,
  },
  statsCardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  loadingContainer: {
    height: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 220,
    position: "relative",
    marginVertical: 20,
  },
  chartCenterTextContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  chartCenterText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  categoriesList: {
    marginTop: 20,
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
  },
  categoryLeftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 15,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  categoryAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  backButton: {
    backgroundColor: "#2262CE",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default StatisticsScreen
