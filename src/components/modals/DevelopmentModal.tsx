"use client"

import type React from "react"
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, Animated, Easing, Image } from "react-native"
import { useRef, useEffect } from "react"

interface DevelopmentModalProps {
  visible: boolean
  title: string
  message: string
  buttonText: string
  onClose: () => void
}

const { width } = Dimensions.get("window")

const DevelopmentModal: React.FC<DevelopmentModalProps> = ({ visible, title, message, buttonText, onClose }) => {
  // Animaciones
  const scaleAnim = useRef(new Animated.Value(0.5)).current
  const opacityAnim = useRef(new Animated.Value(0)).current
  const iconOpacityAnim = useRef(new Animated.Value(0)).current
  const iconScaleAnim = useRef(new Animated.Value(0.5)).current

  useEffect(() => {
    if (visible) {
      // Resetear animaciones
      scaleAnim.setValue(0.5)
      opacityAnim.setValue(0)
      iconOpacityAnim.setValue(0)
      iconScaleAnim.setValue(0.5)

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

      // Animar icono después de un pequeño retraso
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(iconOpacityAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(iconScaleAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
            easing: Easing.out(Easing.back(1.7)),
          }),
        ]).start()
      }, 300)
    }
  }, [visible, scaleAnim, opacityAnim, iconOpacityAnim, iconScaleAnim])

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
            {/* Círculo con icono de desarrollo */}
            <View style={styles.iconCircleContainer}>
              <View style={styles.iconCircle}>
                <Animated.View
                  style={[
                    styles.iconContainer,
                    {
                      opacity: iconOpacityAnim,
                      transform: [{ scale: iconScaleAnim }],
                    },
                  ]}
                >
                  <Image
                    source={require("../../assets/images/development_icon.png")}
                    style={styles.developmentIcon}
                    resizeMode="contain"
                  />
                </Animated.View>
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
  iconCircleContainer: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#2262ce",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  developmentIcon: {
    width: 40,
    height: 40,
    tintColor: "white",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3f3f3f",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#7f7f7f",
    marginBottom: 25,
    textAlign: "center",
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#59cdf2",
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

export default DevelopmentModal
