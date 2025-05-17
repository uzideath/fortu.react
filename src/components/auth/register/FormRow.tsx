import React from "react"
import { View, StyleSheet } from "react-native"

interface FormRowProps {
  children: React.ReactNode
}

const FormRow: React.FC<FormRowProps> = ({ children }) => {
  return (
    <View style={styles.rowContainer}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
})

export default FormRow