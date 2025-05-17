import React from "react"
import { TouchableOpacity, Image, ActivityIndicator, StyleSheet } from "react-native"
import { colors } from "src/styles/colors"

interface ContinueButtonProps {
  onPress: () => void
  isLoading?: boolean
}

const ContinueButton: React.FC<ContinueButtonProps> = ({ onPress, isLoading = false }) => {
  return (
    <TouchableOpacity 
      style={styles.continueButton} 
      onPress={onPress} 
      activeOpacity={0.7}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Image source={require("src/assets/images/arrow_right.png")} style={styles.arrowIcon} />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  continueButton: {
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  arrowIcon: {
    width: 30,
    height: 30,
  },
})

export default ContinueButton