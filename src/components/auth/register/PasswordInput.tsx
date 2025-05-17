import React from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { colors } from "src/styles/colors"

interface PasswordRequirement {
  label: string
  isValid: boolean
  regex: RegExp
}

interface PasswordInputProps {
  label: string
  value: string
  onChangeText: (text: string) => void
  showPassword: boolean
  togglePasswordVisibility: () => void
  onFocus: () => void
  onBlur: () => void
  requirements: PasswordRequirement[]
  showRequirements: boolean
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChangeText,
  showPassword,
  togglePasswordVisibility,
  onFocus,
  onBlur,
  requirements,
  showRequirements,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder=""
          placeholderTextColor="#B0C8EA"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <TouchableOpacity
          style={styles.eyeIconContainer}
          onPress={togglePasswordVisibility}
          activeOpacity={0.7}
        >
          <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#B0C8EA" />
        </TouchableOpacity>
      </View>

      {showRequirements && (
        <View style={styles.passwordRequirementsContainer}>
          {requirements.map((requirement, index) => (
            <View key={index} style={styles.passwordRequirementItem}>
              <View style={[styles.checkCircle, requirement.isValid && styles.checkCircleFilled]}>
                {requirement.isValid && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text
                style={[
                  styles.passwordRequirementText,
                  { color: requirement.isValid ? colors.primary : "#666666" },
                ]}
              >
                {requirement.label}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 5,
  },
  passwordInputContainer: {
    flexDirection: "row",
    backgroundColor: "#D1DFFA",
    borderRadius: 10,
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: colors.text.primary,
  },
  eyeIconContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  passwordRequirementsContainer: {
    marginTop: 10,
    marginBottom: 10,
    padding: 15,
    backgroundColor: "#EFF4FF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1DFFA",
  },
  passwordRequirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#666666",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkCircleFilled: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkMark: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  passwordRequirementText: {
    fontSize: 14,
    fontWeight: "500",
  },
})

export default PasswordInput