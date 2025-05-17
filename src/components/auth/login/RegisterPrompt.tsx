import React from "react"
import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { colors } from "@/styles/colors"

interface RegisterPromptProps {
  onRegisterPress: () => void
}

const RegisterPrompt: React.FC<RegisterPromptProps> = ({ onRegisterPress }) => {
  return (
    <TouchableOpacity style={styles.registerButton} onPress={onRegisterPress}>
      <Text style={styles.registerButtonText}>Crear una cuenta</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  registerButton: {
    alignSelf: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
})

export default RegisterPrompt