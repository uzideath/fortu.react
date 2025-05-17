import React from "react"
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native"
import { colors } from "src/styles/colors"
import Ionicons from "react-native-vector-icons/Ionicons"

interface ErrorModalProps {
  visible: boolean
  onClose: () => void
  message: string
}

const ErrorModal: React.FC<ErrorModalProps> = ({ visible, onClose, message }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="alert-circle" size={50} color={colors.error} />
          </View>
          
          <Text style={styles.modalTitle}>Error</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.error,
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default ErrorModal