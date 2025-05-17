import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { colors } from "src/styles/colors"

interface LoginPromptProps {
  onLoginPress: () => void
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ onLoginPress }) => {
  return (
    <View style={styles.loginContainer}>
      <Text style={styles.loginText}>¿Ya tienes una cuenta en Fortu?</Text>
      <TouchableOpacity onPress={onLoginPress}>
        <Text style={styles.loginButtonText}>Inicia Sesión</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  loginContainer: {
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 5,
  },
  loginButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
})

export default LoginPrompt