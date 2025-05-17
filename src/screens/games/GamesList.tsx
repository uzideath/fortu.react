"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, StatusBar, FlatList } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import type { GamesScreenProps } from "src/types"

// Datos de ejemplo para los juegos de chance
const chanceGames = [
  {
    id: "1",
    name: "Doble Chance",
    description: "Elige 2 números del 00 al 99",
    minBet: "$500",
    maxPrize: "$5.000.000",
  },
  {
    id: "2",
    name: "Triple Chance",
    description: "Elige 3 números del 000 al 999",
    minBet: "$1.000",
    maxPrize: "$10.000.000",
  },
  {
    id: "3",
    name: "Super Chance",
    description: "Elige 4 números del 0000 al 9999",
    minBet: "$2.000",
    maxPrize: "$20.000.000",
  },
  {
    id: "4",
    name: "Chance Millonario",
    description: "Elige 5 números del 00000 al 99999",
    minBet: "$5.000",
    maxPrize: "$50.000.000",
  },
]

const GamesList: React.FC<GamesScreenProps<"GamesList">> = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const [games, setGames] = useState(chanceGames)

  // Renderizar un ítem de juego
  const renderGameItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity style={styles.gameCard} onPress={() => navigation.navigate("GameDetail", { gameId: item.id })}>
        <View style={styles.gameInfo}>
          <Text style={styles.gameName}>{item.name}</Text>
          <Text style={styles.gameDescription}>{item.description}</Text>
          <View style={styles.gameDetails}>
            <View style={styles.gameDetailItem}>
              <Text style={styles.gameDetailLabel}>Apuesta mínima</Text>
              <Text style={styles.gameDetailValue}>{item.minBet}</Text>
            </View>
            <View style={styles.gameDetailItem}>
              <Text style={styles.gameDetailLabel}>Premio máximo</Text>
              <Text style={styles.gameDetailValue}>{item.maxPrize}</Text>
            </View>
          </View>
        </View>
        <View style={styles.gameArrow}>
          <Image source={require("src/assets/images/arrow_right.png")} style={styles.arrowIcon} resizeMode="contain" />
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
          <Text style={styles.headerTitle}>Chance en línea</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Lista de juegos */}
        <FlatList
          data={games}
          renderItem={renderGameItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.gamesList}
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
  gamesList: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  gameCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  gameDescription: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 10,
  },
  gameDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gameDetailItem: {
    flex: 1,
  },
  gameDetailLabel: {
    fontSize: 12,
    color: "#999999",
    marginBottom: 3,
  },
  gameDetailValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2262CE",
  },
  gameArrow: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
  },
  arrowIcon: {
    width: 30,
    height: 30,
    tintColor: "#2262CE",
  },
})

export default GamesList
