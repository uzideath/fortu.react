import React from "react"
import { View, Image, StyleSheet } from "react-native"

const Logo = () => {
  return (
    <View style={styles.logoWrapper}>
      <View style={styles.logoContainer}>
        <Image source={require("src/assets/images/logo_t.png")} style={styles.logo} resizeMode="contain" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  logoWrapper: {
    width: "100%",
    alignItems: "flex-start",
    paddingLeft: 20,
    marginBottom: 20,
  },
  logoContainer: {
    width: 60,
    height: 60,
  },
  logo: {
    width: 60,
    height: 60,
  },
})

export default Logo