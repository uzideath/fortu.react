"use client"

import type React from "react"
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, Animated, Easing } from "react-native"
import { useRef, useEffect } from "react"
import { colors } from "../../styles/colors"

interface InfoModalProps {
  visible: boolean
  title: string
  message: string
  buttonText: string
  onClose: () => void
  icon?: string // Emoji o texto para el ícono
}

const { width } = Dimensions.get("window")

const InfoModal: React.FC<InfoModalProps> = ({ visible, title, message, buttonText, onClose, icon = "🔨" }) => {
  // Animaciones
  const scaleAnim = useRef(new Animated.Value(0)).current
  const opacityAnim = useRef(new Animated.Value(0)).current
  const iconOpacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      // Resetear animaciones
      scaleAnim.setValue(0.5)
      opacityAnim.setValue(0)
      iconOpacityAnim.setValue(0)

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

      // Animar ícono después de un pequeño retraso
      setTimeout(() => {
        Animated.timing(iconOpacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start()
      }, 300)
    }
  }, [visible, scaleAnim, opacityAnim, iconOpacityAnim])

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
            {/* Círculo con ícono */}
            <View style={styles.iconCircleContainer}>
              <View style={styles.iconCircle}>
                <Animated.Text style={[styles.icon, { opacity: iconOpacityAnim }]}>{icon}</Animated.Text>
              </View>
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            <TouchableOpacity style={styles.button} onPress={onClose}>
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
  iconCircleContainer: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    color: "white",
    fontSize: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 25,
    textAlign: "center",
    lineHeight: 22,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default InfoModal
