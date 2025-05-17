"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Dimensions } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"

interface EmailSuccessModalProps {
  visible: boolean
  onClose: () => void
}

const EmailSuccessModal: React.FC<EmailSuccessModalProps> = ({ visible, onClose }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current
  const checkmarkAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      // Animación de entrada
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(checkmarkAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      // Resetear animaciones
      scaleAnim.setValue(0)
      checkmarkAnim.setValue(0)
    }
  }, [visible, scaleAnim, checkmarkAnim])

  const handleClose = () => {
    // Animación de salida
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose()
    })
  }

  const checkmarkScale = checkmarkAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.2, 1],
  })

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.modalBackground}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ scale: checkmarkScale }],
              },
            ]}
          >
            <Ionicons name="checkmark" size={40} color="white" />
          </Animated.View>

          <Text style={styles.title}>¡Correo enviado!</Text>
          <Text style={styles.message}>
            Se ha enviado un mensaje a tu correo electrónico con instrucciones para recuperar tu contraseña.
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleClose} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Aceptar</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: Dimensions.get("window").width * 0.85,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#4CAF50", // Verde para éxito
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "#2262ce",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
})

export default EmailSuccessModal
