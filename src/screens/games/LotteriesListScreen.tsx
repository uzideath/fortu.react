"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  FlatList,
  Dimensions,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import type { GamesScreenProps, Lottery } from "src/types"

const { width } = Dimensions.get("window")

// Datos de ejemplo para las loterías
const lotteriesData: Lottery[] = [
  {
    id: "1",
    name: "Lotería de Medellín",
    icon: "loteria_medellin",
    nextDraw: "Viernes, 20 de Mayo",
    prize: "$10.000.000",
    score: 4.5,
  },
  {
    id: "2",
    name: "Lotería del Huila",
    icon: "loteria_huila",
    nextDraw: "Lunes, 23 de Mayo",
    prize: "$8.000.000",
    score: 4.2,
  },
  {
    id: "3",
    name: "Baloto",
    icon: "Baloto2012",
    nextDraw: "Miércoles, 25 de Mayo",
    prize: "$15.000.000",
    score: 4.8,
  },
  {
    id: "4",
    name: "Lotería del Cauca",
    icon: "loteria_medellin", // Usar un icono existente como placeholder
    nextDraw: "Sábado, 28 de Mayo",
    prize: "$7.500.000",
    score: 4.0,
  },
  {
    id: "5",
    name: "Lotería de Boyacá",
    icon: "loteria_huila", // Usar un icono existente como placeholder
    nextDraw: "Domingo, 29 de Mayo",
    prize: "$9.000.000",
    score: 4.3,
  },
]

// Función para obtener la imagen del logo basada en el icono
const getLotteryLogo = (icon: string) => {
  switch (icon) {
    case "loteria_medellin":
      return require("src/assets/images/loteria_medellin.png")
    case "loteria_huila":
      return require("src/assets/images/loteria_huila.png")
    case "Baloto2012":
      return require("src/assets/images/Baloto2012.png")
    default:
      return require("src/assets/images/loteria_medellin.png") // Logo por defecto
  }
}

const LotteriesListScreen: React.FC<GamesScreenProps<"LotteriesList">> = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const [lotteries, setLotteries] = useState<Lottery[]>(lotteriesData)

  // Renderizar un ítem de lotería
  const renderLotteryItem = ({ item }: { item: Lottery }) => {
    return (
      <TouchableOpacity
        style={styles.lotteryCard}
        onPress={() => navigation.navigate("GameDetail", { gameId: item.id })}
      >
        <View style={styles.lotteryLogoContainer}>
          <Image source={getLotteryLogo(item.icon)} style={styles.lotteryLogo} resizeMode="contain" />
        </View>
        <View style={styles.lotteryInfo}>
          <Text style={styles.lotteryName}>{item.name}</Text>
          <Text style={styles.lotteryNextDraw}>Próximo sorteo: {item.nextDraw}</Text>
          <Text style={styles.lotteryPrize}>Premio: {item.prize}</Text>
          <View style={styles.lotteryRating}>
            <Text style={styles.lotteryRatingText}>{item.score.toFixed(1)}</Text>
            <View style={styles.lotteryStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Text key={star} style={star <= Math.floor(item.score) ? styles.starFilled : styles.starEmpty}>
                  ★
                </Text>
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <ImageBackground
      source={require("src/assets/images/Fondo14_FORTU.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="#2262CE" />
      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* Header */}
        <View style={[styles.header, { marginTop: insets.top }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={require("src/assets/images/back_button.png")} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loterías en línea</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Lista de loterías */}
        <FlatList
          data={lotteries}
          renderItem={renderLotteryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lotteriesList}
          showsVerticalScrollIndicator={false}
        />
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerRight: {
    width: 40,
  },
  lotteriesList: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  lotteryCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lotteryLogoContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  lotteryLogo: {
    width: 70,
    height: 70,
  },
  lotteryInfo: {
    flex: 1,
    justifyContent: "center",
  },
  lotteryName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  lotteryNextDraw: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 3,
  },
  lotteryPrize: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2262CE",
    marginBottom: 5,
  },
  lotteryRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  lotteryRatingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
    marginRight: 5,
  },
  lotteryStars: {
    flexDirection: "row",
  },
  starFilled: {
    fontSize: 14,
    color: "#FEC937",
  },
  starEmpty: {
    fontSize: 14,
    color: "#DDDDDD",
  },
})

export default LotteriesListScreen
