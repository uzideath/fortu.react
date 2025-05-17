import type React from "react"
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { colors } from "src/styles/colors"
import Ionicons from "react-native-vector-icons/Ionicons"

interface SuccessPaymentModalProps {
  visible: boolean
  onClose: () => void
  message?: string
  buttonText?: string
}

const { width } = Dimensions.get("window")

const SuccessPaymentModal: React.FC<SuccessPaymentModalProps> = ({
  visible,
  onClose,
  message = "Tarjeta guardada exitosamente",
  buttonText = "Continuar",
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={60} color={colors.success} />
          </View>

          <Text style={styles.modalTitle}>¡Éxito!</Text>

          <View style={styles.modalBody}>
            <Text style={styles.modalMessage}>{message}</Text>
          </View>

          <TouchableOpacity style={styles.modalButton} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.modalButtonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.success,
    marginBottom: 15,
  },
  modalBody: {
    width: "100%",
    marginBottom: 25,
  },
  modalMessage: {
    fontSize: 18,
    color: colors.text.primary,
    textAlign: "center",
    lineHeight: 26,
  },
  modalButton: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default SuccessPaymentModal
