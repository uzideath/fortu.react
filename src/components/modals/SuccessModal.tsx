"use client"

import type React from "react"
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, Animated, Easing } from "react-native"
import { useRef, useEffect } from "react"

interface SuccessModalProps {
  visible: boolean
  title: string
  message: string
  buttonText: string
  onClose: () => void
}

const { width } = Dimensions.get("window")

const SuccessModal: React.FC<SuccessModalProps> = ({ visible, title, message, buttonText, onClose }) => {
  // Animaciones
  const scaleAnim = useRef(new Animated.Value(0.5)).current
  const opacityAnim = useRef(new Animated.Value(0)).current
  const checkmarkOpacityAnim = useRef(new Animated.Value(0)).current
  const checkmarkScaleAnim = useRef(new Animated.Value(0.5)).current

  useEffect(() => {
    if (visible) {
      // Resetear animaciones
      scaleAnim.setValue(0.5)
      opacityAnim.setValue(0)
      checkmarkOpacityAnim.setValue(0)
      checkmarkScaleAnim.setValue(0.5)

      // Animar entrada del modal
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()

      // Animar checkmark después de un pequeño retraso
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(checkmarkOpacityAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(checkmarkScaleAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
            easing: Easing.out(Easing.back(1.7)),
          }),
        ]).start()
      }, 300)
    }
  }, [visible, scaleAnim, opacityAnim, checkmarkOpacityAnim, checkmarkScaleAnim])

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.modalContent}>
            {/* Círculo de éxito con checkmark */}
            <View style={styles.successCircleContainer}>
              <View style={styles.successCircle}>
                <Animated.Text
                  style={[
                    styles.checkmark,
                    {
                      opacity: checkmarkOpacityAnim,
                      transform: [{ scale: checkmarkScaleAnim }],
                    },
                  ]}
                >
                  ✓
                </Animated.Text>
              </View>
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContent: {
    padding: 25,
    alignItems: "center",
  },
  successCircleContainer: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  successCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#59cdf2", // Color secundario de la app
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3f3f3f", // Color de texto primario
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#7f7f7f", // Color de texto secundario
    marginBottom: 25,
    textAlign: "center",
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#59cdf2", // Color secundario de la app
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default SuccessModal
