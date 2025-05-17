"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, StatusBar, FlatList } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import type { GamesScreenProps, Group } from "src/types"

// Datos de ejemplo para los grupos
const groupsData: Group[] = [
  {
    id: "1",
    name: "Grupo Baloto",
    members: 15,
    game: "Baloto",
    tickets: 10,
    score: 4.5,
    totalAmount: "$150.000",
  },
  {
    id: "2",
    name: "Lotería de Medellín",
    members: 8,
    game: "Lotería de Medellín",
    tickets: 5,
    score: 4.2,
    totalAmount: "$80.000",
  },
  {
    id: "3",
    name: "Super Chance Grupal",
    members: 12,
    game: "Super Chance",
    tickets: 8,
    score: 4.7,
    totalAmount: "$120.000",
  },
  {
    id: "4",
    name: "Grupo Lotería del Huila",
    members: 6,
    game: "Lotería del Huila",
    tickets: 3,
    score: 4.0,
    totalAmount: "$60.000",
  },
]

const GroupDrawScreen: React.FC<GamesScreenProps<"GroupDraw">> = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const [groups, setGroups] = useState<Group[]>(groupsData)

  // Renderizar un ítem de grupo
  const renderGroupItem = ({ item }: { item: Group }) => {
    return (
      <TouchableOpacity
        style={styles.groupCard}
        onPress={() => navigation.navigate("GroupDetail", { groupId: item.id })}
      >
        <View style={styles.groupInfo}>
          <Text style={styles.groupName}>{item.name}</Text>
          <View style={styles.groupDetails}>
            <View style={styles.groupDetailItem}>
              <Text style={styles.groupDetailLabel}>Miembros</Text>
              <Text style={styles.groupDetailValue}>{item.members}</Text>
            </View>
            <View style={styles.groupDetailItem}>
              <Text style={styles.groupDetailLabel}>Juego</Text>
              <Text style={styles.groupDetailValue}>{item.game}</Text>
            </View>
          </View>
          <View style={styles.groupDetails}>
            <View style={styles.groupDetailItem}>
              <Text style={styles.groupDetailLabel}>Boletos</Text>
              <Text style={styles.groupDetailValue}>{item.tickets}</Text>
            </View>
            <View style={styles.groupDetailItem}>
              <Text style={styles.groupDetailLabel}>Monto total</Text>
              <Text style={styles.groupDetailValue}>{item.totalAmount}</Text>
            </View>
          </View>
          <View style={styles.groupRating}>
            <Text style={styles.groupRatingText}>{item.score.toFixed(1)}</Text>
            <View style={styles.groupStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Text key={star} style={star <= Math.floor(item.score) ? styles.starFilled : styles.starEmpty}>
                  ★
                </Text>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.groupArrow}>
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
          <Text style={styles.headerTitle}>Sorteos grupales</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Lista de grupos */}
        <FlatList
          data={groups}
          renderItem={renderGroupItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.groupsList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.createGroupContainer}>
              <TouchableOpacity style={styles.createGroupButton} onPress={() => console.log("Crear nuevo grupo")}>
                <Text style={styles.createGroupText}>+ Crear nuevo grupo</Text>
              </TouchableOpacity>
            </View>
          }
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
  createGroupContainer: {
    marginBottom: 20,
  },
  createGroupButton: {
    backgroundColor: "#2262CE",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createGroupText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  groupsList: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  groupCard: {
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
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },
  groupDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  groupDetailItem: {
    flex: 1,
  },
  groupDetailLabel: {
    fontSize: 12,
    color: "#999999",
    marginBottom: 3,
  },
  groupDetailValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
  },
  groupRating: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  groupRatingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
    marginRight: 5,
  },
  groupStars: {
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
  groupArrow: {
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

export default GroupDrawScreen
