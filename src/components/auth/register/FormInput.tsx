import React from "react"
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle } from "react-native"
import { colors } from "src/styles/colors"

interface FormInputProps extends TextInputProps {
  label: string
  containerStyle?: ViewStyle
}

const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  containerStyle, 
  placeholder = "", 
  placeholderTextColor = "#B0C8EA",
  ...props 
}) => {
  return (
    <View style={[styles.inputContainer, containerStyle]}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        {...props}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#D1DFFA",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: colors.text.primary,
  },
})

export default FormInput