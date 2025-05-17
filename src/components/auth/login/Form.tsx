import React, { useState } from "react"
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  ActivityIndicator
} from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { colors } from "@/styles/colors"

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>
  onForgotPassword: () => void
  isLoading: boolean
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onLogin, 
  onForgotPassword,
  isLoading
}) => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const handleEmailChange = (text: string) => {
    setEmail(text)
  }

  const handlePasswordChange = (text: string) => {
    setPassword(text)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleLoginPress = () => {
    onLogin(email, password)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.loginText}>Iniciar sesión</Text>

      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <Image
            source={require("@/assets/images/Group.png")}
            style={styles.inputIconImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.textInputWrapper}>
          <TextInput
            style={[styles.input, { textAlign: "center" }]}
            placeholder="Usuario"
            placeholderTextColor="#B0C8EA"
            value={email}
            onChangeText={handleEmailChange}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <Image
            source={require("@/assets/images/Vector.png")}
            style={styles.inputIconImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.textInputWrapper}>
          <TextInput
            style={[styles.input, { textAlign: "center" }]}
            placeholder="Contraseña"
            placeholderTextColor="#B0C8EA"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry={!showPassword}
          />
        </View>
        <TouchableOpacity
          style={styles.eyeIconContainer}
          onPress={togglePasswordVisibility}
          activeOpacity={0.7}
        >
          <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#B0C8EA" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.forgotPasswordButton} onPress={onForgotPassword}>
        <Text style={styles.forgotPasswordText}>¿Olvidó su clave?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={handleLoginPress} 
        activeOpacity={0.7}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.loginButtonText}>Ingresar</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  loginText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 30,
    marginBottom: 10,
    paddingHorizontal: 15,
    height: 45,
    position: "relative",
  },
  iconContainer: {
    marginRight: 10,
    width: 20,
  },
  inputIconImage: {
    width: 20,
    height: 20,
    tintColor: "#B0C8EA",
  },
  textInputWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 40,
    fontSize: 16,
    color: colors.text.primary,
  },
  eyeIconContainer: {
    position: "absolute",
    right: 15,
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  forgotPasswordButton: {
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    padding: 12,
    alignItems: "center",
    marginBottom: 15,
    height: 45,
    justifyContent: "center",
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default LoginForm