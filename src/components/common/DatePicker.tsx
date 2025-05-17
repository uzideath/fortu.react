import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import Ionicons from "react-native-vector-icons/Ionicons"
import { colors } from "src/styles/colors"

interface DatePickerProps {
  label: string
  value: Date | null
  onChange: (date: Date) => void
  containerStyle?: any
  placeholder?: string
  maximumDate?: Date
  minimumDate?: Date
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  containerStyle,
  placeholder = "Seleccionar fecha",
  maximumDate = new Date(), // Default to current date as max
  minimumDate = new Date(1900, 0, 1), // Default minimum date
}) => {
  const [showPicker, setShowPicker] = useState(false)
  const [tempDate, setTempDate] = useState<Date>(value || new Date())

  // Format date for display
  const formatDate = (date: Date | null): string => {
    if (!date) return ""
    
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    
    return `${day}/${month}/${year}`
  }

  const handleOpenPicker = () => {
    setShowPicker(true)
  }

  const handleClosePicker = () => {
    setShowPicker(false)
  }

  const handleConfirm = () => {
    onChange(tempDate)
    handleClosePicker()
  }

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      handleClosePicker()
      if (selectedDate) {
        setTempDate(selectedDate)
        onChange(selectedDate)
      }
    } else {
      if (selectedDate) {
        setTempDate(selectedDate)
      }
    }
  }

  // Render different pickers based on platform
  const renderDatePicker = () => {
    if (Platform.OS === "ios") {
      return (
        <Modal
          visible={showPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={handleClosePicker}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleClosePicker}>
                  <Text style={styles.modalCancelButton}>Cancelar</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Seleccionar fecha</Text>
                <TouchableOpacity onPress={handleConfirm}>
                  <Text style={styles.modalDoneButton}>Listo</Text>
                </TouchableOpacity>
              </View>
              
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                locale="es-ES"
              />
            </View>
          </View>
        </Modal>
      )
    } else {
      // Android picker opens directly without modal
      return showPicker && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      )
    }
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={handleOpenPicker}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.pickerText,
          !value && styles.placeholderText
        ]}>
          {value ? formatDate(value) : placeholder}
        </Text>
        {/* <Ionicons name="calendar-outline" size={20} color="#B0C8EA" /> */}
      </TouchableOpacity>
      
      {renderDatePicker()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 5,
  },
  pickerButton: {
    backgroundColor: "#D1DFFA",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  placeholderText: {
    color: "#B0C8EA",
  },
  // Modal styles for iOS
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.text.primary,
  },
  modalCancelButton: {
    fontSize: 16,
    color: colors.error,
  },
  modalDoneButton: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "bold",
  },
})

export default DatePicker