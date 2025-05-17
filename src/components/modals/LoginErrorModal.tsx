"use client"

import type React from "react"
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, Animated } from "react-native"
import { useRef, useEffect } from "react"
import Ionicons from "react-native-vector-icons/Ionicons"
import { colors } from "@/styles/colors"

interface LoginErrorModalProps {
  visible: boolean
  onClose: () => void
  message?: string // Mensaje personalizado opcional
}

const LoginErrorModal: React.FC<LoginErrorModalProps> = ({
  visible,
  onClose,
  message = "¡Ups! Esa no es tu clave", // Mensaje predeterminado
}) => {
  // Animaciones
  const scaleAnim = useRef(new Animated.Value(0)).current
  const opacityAnim = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0.5)
      opacityAnim.setValue(0)

      // Start animations
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()

      // Start pulse animation
      startPulseAnimation()
    }
  }, [visible])

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }

  const handleClose = () => {
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose()
    })
  }

  return (
    <Modal animationType="none" transparent={true} visible={visible} onRequestClose={handleClose}>
      <Animated.View style={[styles.centeredView, { opacity: opacityAnim }]}>
        <Animated.View
          style={[
            styles.modalView,
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
            <Ionicons name="close" size={30} color="#034287" />
          </Animated.View>

          <Text style={styles.modalText}>{message}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleClose} activeOpacity={0.7}>
              <Text style={styles.buttonText}>Volver a intentar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: Dimensions.get("window").width * 0.85,
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  iconContainer: {
    position: "absolute",
    top: -25,
    backgroundColor: "#59cdf2",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
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
  modalText: {
    marginTop: 20,
    marginBottom: 25,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  button: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "white",
    padding: 12,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
})

export default LoginErrorModal
