"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Easing } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { colors } from "@/styles/colors"

interface EmailErrorModalProps {
  visible: boolean
  onClose: () => void
  message: string
}

const EmailErrorModal: React.FC<EmailErrorModalProps> = ({ visible, onClose, message }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start()

      // Iniciar la animación de pulso para el ícono X
      startPulseAnimation()
    } else {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }, [visible])

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.modalOverlay}>
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
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Ionicons name="alert-circle" size={40} color="white" />
          </Animated.View>

          <Text style={styles.modalText}>{message}</Text>

          <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Entendido</Text>
          </TouchableOpacity>
        </Animated.View>
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
    width: "80%",
    backgroundColor: colors.primary,
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
    backgroundColor: "#59cdf2",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -35,
    marginBottom: 15,
  },
  modalText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "500",
  },
  button: {
    width: "80%",
    height: 45,
    backgroundColor: "#59cdf2",
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
})

export default EmailErrorModal
