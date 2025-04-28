"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Modal,
  StatusBar,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Platform,
  type ImageStyle,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { colors } from "../../styles/colors"

const { width } = Dimensions.get("window")

interface PaymentMethod {
  id: string
  image: any
  imageStyle?: ImageStyle
}

const LoadPaymentMethodScreen: React.FC = () => {
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)
  // Aumentamos los valores base
  const [statusBarHeight, setStatusBarHeight] = useState(Platform.OS === "ios" ? 60 : 40)

  // Detectar si el dispositivo tiene notch o isla dinámica
  useEffect(() => {
    if (Platform.OS === "ios") {
      // En iOS, podemos usar una altura mayor para asegurarnos de que el contenido esté debajo de la isla
      const hasNotchOrIsland = Dimensions.get("window").height > 800
      // Aumentamos los valores para dispositivos con notch o isla
      setStatusBarHeight(hasNotchOrIsland ? 90 : 60)
    }
  }, [])

  const [tickets] = useState([
    { id: 1, chance: "Chance", lottery: "Lot.", location: "Huila", number: "- 3 5 8" },
    { id: 2, chance: "Chance", lottery: "Lot.", location: "Huila", number: "- 1 5 9" },
    { id: 3, chance: "Chance", lottery: "Lot.", location: "Huila", number: "7 4 6 8" },
    { id: 4, chance: "Chance", lottery: "Lot.", location: "Huila", number: "7 4 6 8" },
    { id: 5, chance: "Chance", lottery: "Lot.", location: "Huila", number: "7 4 6 8" },
    { id: 6, chance: "Chance", lottery: "Lot.", location: "Huila", number: "7 4 6 8" },
  ])

  const paymentMethods: PaymentMethod[] = [
    { id: "mastercard", image: require("../../assets/images/mastercard_logo.png") },
    { id: "nequi", image: require("../../assets/images/nequi_logo_new.png") },
    { id: "daviplata", image: require("../../assets/images/daviplata_logo_new.png") },
    {
      id: "pse",
      image: require("../../assets/images/pse_logo.png"),
    },
  ]

  const handlePaymentMethodPress = (methodId: string) => {
    if (selectedPaymentMethod === methodId) {
      setSelectedPaymentMethod(null)
    } else {
      setSelectedPaymentMethod(methodId)
    }
  }

  const handleFinishPress = () => {
    setModalVisible(true)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <ImageBackground
        source={require("../../assets/images/Fondo5_FORTU.png")}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Header con espacio adicional para la isla dinámica y margen superior */}
        <View
          style={[
            styles.header,
            {
              paddingTop: statusBarHeight,
              marginTop: 15, // Añadimos margen superior adicional
            },
          ]}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image
              source={require("../../assets/images/back_button.png")}
              style={styles.backButtonImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Sección de pago</Text>
            <Text style={styles.headerSubtitle}>Resumen de transacción</Text>
          </View>

          {/* Espacio vacío para equilibrar el header */}
          <View style={styles.emptySpace} />
        </View>

        {/* Payment Methods Grid */}
        <View style={styles.paymentMethodsGrid}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethodCard,
                selectedPaymentMethod === method.id && styles.selectedPaymentMethodCard,
                selectedPaymentMethod !== null &&
                  selectedPaymentMethod !== method.id &&
                  styles.unselectedPaymentMethodCard,
              ]}
              onPress={() => handlePaymentMethodPress(method.id)}
            >
              <View style={method.id === "pse" ? styles.pseContainer : styles.normalContainer}>
                <Image
                  source={method.image}
                  style={[styles.paymentMethodImage, method.id === "pse" && styles.pseImage]}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Details */}
        <View style={styles.paymentDetailsContainer}>
          <View style={styles.paymentDetailsContent}>
            <Text style={styles.paymentDetailsTitle}>Detalles de pago</Text>

            <ScrollView style={styles.ticketsContainer} showsVerticalScrollIndicator={false}>
              {tickets.map((ticket) => (
                <View key={ticket.id} style={styles.ticketRow}>
                  <Text style={styles.ticketText}>{ticket.chance}</Text>
                  <Text style={styles.ticketText}>{ticket.lottery}</Text>
                  <Text style={styles.ticketText}>{ticket.location}</Text>
                  <View style={styles.numberBox}>
                    <Text style={styles.numberText}>{ticket.number}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total: $21.400</Text>
            </View>

            <TouchableOpacity style={styles.finishButton} onPress={handleFinishPress}>
              <Text style={styles.finishButtonText}>Finalizar</Text>
            </TouchableOpacity>

            <View style={styles.disclaimerContainer}>
              <Text style={styles.disclaimerText}>
                <Text style={styles.disclaimerBold}>Importante: </Text>
                Verifique cuidadosamente sus números de la suerte antes de realizar la transacción. Fortu no se hará
                responsable por reclamos derivados de errores o equivocaciones. Le recomendamos leer atentamente
                nuestros <Text style={styles.termsText}>Términos y condiciones.</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Información</Text>
              <Text style={styles.modalText}>
                Esta funcionalidad estará disponible próximamente. Estamos trabajando para ofrecerte la mejor
                experiencia.
              </Text>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Entendido</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
  },
  backButtonImage: {
    width: 40,
    height: 40,
  },
  emptySpace: {
    width: 40,
  },
  headerTitleContainer: {
    alignItems: "center",
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.8,
    textAlign: "center",
  },
  paymentMethodsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  paymentMethodCard: {
    width: (width - 60) / 2,
    height: 100,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    marginBottom: 20,
  },
  selectedPaymentMethodCard: {
    borderWidth: 2,
    borderColor: "#59CDF2",
  },
  unselectedPaymentMethodCard: {
    opacity: 0.5,
  },
  paymentMethodImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  normalContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  pseContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  pseImage: {
    width: "70%",
    height: "70%",
  },
  paymentDetailsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "58%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  paymentDetailsContent: {
    padding: 24,
    flex: 1,
  },
  paymentDetailsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 20,
  },
  ticketsContainer: {
    maxHeight: 260,
    marginBottom: 15,
  },
  ticketRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    backgroundColor: "#F7F7F7",
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  ticketText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  numberBox: {
    backgroundColor: "#458DCE",
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
  },
  numberText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 2,
  },
  totalContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  finishButton: {
    backgroundColor: "#59CDF2",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  finishButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
  },
  disclaimerContainer: {
    paddingHorizontal: 10,
  },
  disclaimerText: {
    fontSize: 11,
    lineHeight: 16,
    color: "#666",
    textAlign: "center",
  },
  disclaimerBold: {
    fontWeight: "700",
    color: "#333",
  },
  termsText: {
    textDecorationLine: "underline",
    color: "#458DCE",
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  modalText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: "#458DCE",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
})

export default LoadPaymentMethodScreen
