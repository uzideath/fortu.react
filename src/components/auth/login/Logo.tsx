import React from "react"
import { View, Image, StyleSheet } from "react-native"

const Logo = () => {
  return (
    <View style={styles.logoContainer}>
      <Image 
        source={require("@/assets/images/Logo_FORTU.png")} 
        style={styles.logo} 
        resizeMode="contain" 
      />
    </View>
  )
}

const styles = StyleSheet.create({
  logoContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 180,
    height: 70,
  },
})

export default Logo