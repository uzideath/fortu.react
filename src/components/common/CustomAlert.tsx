"use client"

import React, { useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Image,
} from "react-native"

const { width } = Dimensions.get("window")

interface CustomAlertProps {
  visible: boolean
  title: string
  message: string
  onCancel: () => void
  onConfirm: () => void
  cancelText?: string
  confirmText?: string
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  cancelText = "Cancelar",
  confirmText = "Confirmar",
}) => {
  // Animaciones
  const fadeAnim = React.useRef(new Animated.Value(0)).current
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current

  useEffect(() => {
    if (visible) {
      // Resetear animaciones
      fadeAnim.setValue(0)
      scaleAnim.setValue(0.9)

      // Iniciar animaciones cuando el modal es visible
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
      ]).start()
    }
  }, [visible, fadeAnim, scaleAnim])

  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableWithoutFeedback onPress={onCancel}>
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              {/* Icono en la parte superior */}
              <View style={styles.iconContainer}>
                <View style={styles.iconCircle}>
                  <Image
                    source={require("src/assets/images/cerrar_sesion_icon.png")}
                    style={styles.icon}
                    resizeMode="contain"
                  />
                </View>
              </View>

              {/* Contenido */}
              <View style={styles.contentContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
              </View>

              {/* Botones */}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.7}>
                  <Text style={styles.cancelButtonText}>{cancelText}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.confirmButton} onPress={onConfirm} activeOpacity={0.7}>
                  <Text style={styles.confirmButtonText}>{confirmText}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
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
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    paddingTop: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f4ff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2262ce",
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: "#2262ce",
  },
  contentContainer: {
    paddingHorizontal: 24,
    alignItems: "center",
    marginBottom: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2262ce",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#3f3f3f",
    textAlign: "center",
    lineHeight: 22,
  },
  buttonsContainer: {
    flexDirection: "column",
    borderTopWidth: 1,
    borderTopColor: "#ebebeb",
  },
  cancelButton: {
    paddingVertical: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ebebeb",
  },
  cancelButtonText: {
    color: "#3f3f3f",
    fontSize: 16,
    fontWeight: "500",
  },
  confirmButton: {
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#2262ce",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default CustomAlert
