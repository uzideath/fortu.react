import React from "react"
import { View, Text, StyleSheet } from "react-native"
import CustomCheckbox from "src/components/common/CustomCheckbox"
import { colors } from "src/styles/colors"

interface CheckboxItem {
  checked: boolean
  onPress: () => void
  label: string
  linkText?: string
  onLinkPress?: () => void
}

interface CheckboxGroupProps {
  items: CheckboxItem[]
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ items }) => {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <CustomCheckbox
          key={index}
          checked={item.checked}
          onPress={item.onPress}
          label={
            <Text style={styles.checkboxText}>
              {item.linkText ? (
                <>
                  {item.label.split(item.linkText)[0]}
                  <Text style={styles.checkboxLink} onPress={item.onLinkPress}>
                    {item.linkText}
                  </Text>
                  {item.label.split(item.linkText)[1]}
                </>
              ) : (
                item.label
              )}
            </Text>
          }
          containerStyle={styles.checkboxContainer}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  checkboxContainer: {
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkboxText: {
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
    flexWrap: "wrap",
  },
  checkboxLink: {
    color: colors.primary,
    textDecorationLine: "underline",
  },
})

export default CheckboxGroup