import React, { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, ScrollView, ViewStyle } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { colors } from "src/styles/colors"
import { normalizeText } from "@/lib/utils"
import { ciudadesPorDepartamento, departamentos } from "@/lib/departments"
import { LocationItem } from "@/types/types"

interface LocationSelectorProps {
  type: "departamento" | "ciudad"
  label: string
  value: string
  onSelect: (item: LocationItem) => void
  containerStyle?: ViewStyle
  disabled?: boolean
  departmentId?: string | null
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  type,
  label,
  value,
  onSelect,
  containerStyle,
  disabled = false,
  departmentId = null,
}) => {
  const [showModal, setShowModal] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [suggestions, setSuggestions] = useState<LocationItem[]>([])

  useEffect(() => {
    if (type === "departamento") {
      if (searchText.length > 0) {
        const searchTerm = normalizeText(searchText)
        const filteredSuggestions = departamentos.filter((item) => {
          const normalizedLabel = item.normalizedLabel || normalizeText(item.label)
          if (normalizedLabel === searchTerm) return true
          if (normalizedLabel.startsWith(searchTerm)) return true
          if (normalizedLabel.includes(searchTerm)) return true
          const words = normalizedLabel.split(" ")
          if (words.some((word) => word.startsWith(searchTerm))) return true
          return false
        })
        
        setSuggestions(filteredSuggestions)
      } else {
        setSuggestions(departamentos)
      }
    } else if (type === "ciudad" && departmentId) {
      const ciudadesDisponibles = ciudadesPorDepartamento[departmentId] || []
      
      if (searchText.length > 0) {
        const searchTerm = normalizeText(searchText)
        const filteredSuggestions = ciudadesDisponibles.filter((item) => {
          const normalizedLabel = item.normalizedLabel || normalizeText(item.label)
          if (normalizedLabel === searchTerm) return true
          if (normalizedLabel.startsWith(searchTerm)) return true
          if (normalizedLabel.includes(searchTerm)) return true
          const words = normalizedLabel.split(" ")
          if (words.some((word) => word.startsWith(searchTerm))) return true
          return false
        })
        
        setSuggestions(filteredSuggestions)
      } else {
        setSuggestions(ciudadesDisponibles)
      }
    }
  }, [searchText, type, departmentId])

  const handleItemSelect = (item: LocationItem) => {
    onSelect(item)
    setShowModal(false)
    setSearchText("")
  }

  return (
    <View style={containerStyle}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity
        style={[styles.selectInput, disabled && styles.disabledInput]}
        onPress={() => !disabled && setShowModal(true)}
        disabled={disabled}
      >
        <Text style={[styles.selectInputText, !value && { color: "#B0C8EA" }]}>
          {value || ""}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#B0C8EA" />
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {type === "departamento" ? "Selecciona un departamento" : "Selecciona una ciudad"}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalSearchInput}
              placeholder={type === "departamento" ? "Buscar departamento" : "Buscar ciudad"}
              placeholderTextColor="#B0C8EA"
              value={searchText}
              onChangeText={setSearchText}
              autoCapitalize="words"
            />

            <ScrollView style={styles.modalList}>
              {suggestions.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.modalItem}
                  onPress={() => handleItemSelect(item)}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  inputLabel: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 5,
  },
  selectInput: {
    backgroundColor: "#D1DFFA",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectInputText: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
  },
  disabledInput: {
    backgroundColor: "#E5E5E5",
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: "90%",
    maxHeight: "70%",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  modalSearchInput: {
    backgroundColor: "#D1DFFA",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 15,
  },
  modalList: {
    maxHeight: 300,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalItemText: {
    fontSize: 16,
    color: colors.text.primary,
  },
})

export default LocationSelector