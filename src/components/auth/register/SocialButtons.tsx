import React from "react"
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native"
import { colors } from "src/styles/colors"

interface SocialButtonsProps {
  onGooglePress: () => void
  onApplePress: () => void
}

const SocialButtons: React.FC<SocialButtonsProps> = ({ onGooglePress, onApplePress }) => {
  return (
    <View style={styles.socialButtonsContainer}>
      <TouchableOpacity style={styles.socialButton} onPress={onGooglePress}>
        <Image
          source={require("src/assets/images/google_logo.jpg")}
          style={styles.socialLogo}
          resizeMode="contain"
        />
        <Text style={styles.socialButtonText}>Continuar con google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton} onPress={onApplePress}>
        <Image
          source={require("src/assets/images/apple_logo.png")}
          style={styles.socialLogo}
          resizeMode="contain"
        />
        <Text style={styles.socialButtonText}>Continuar AppleID</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  socialButtonsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 30,
    padding: 10,
    marginBottom: 10,
    height: 50,
  },
  socialLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  socialButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    textAlign: "center",
  },
})

export default SocialButtons