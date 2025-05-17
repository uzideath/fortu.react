import type React from "react"
import { View, TouchableOpacity, StyleSheet, type StyleProp, type ViewStyle } from "react-native"
import { colors } from "src/styles/colors"
import Ionicons from "react-native-vector-icons/Ionicons"

interface CustomCheckboxProps {
  checked: boolean
  onPress: () => void
  label: React.ReactNode
  containerStyle?: StyleProp<ViewStyle>
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onPress, label, containerStyle }) => {
  return (
    <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
      </View>
      <View style={styles.labelContainer}>{label}</View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 10,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  labelContainer: {
    flex: 1,
  },
})

export default CustomCheckbox
