"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
  TextInput,
  ScrollView,
  Dimensions,
  Animated,
  Modal,
  FlatList,
  Alert,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import type { MainScreenProps } from "src/types"
import { SafeAreaView } from "react-native-safe-area-context"
import SuccessModal from "src/components/modals/SuccessModal"
import { getAllAvatars, saveSelectedAvatar, getSelectedAvatar, type AvatarInfo } from "src/services/avatarService"

const { width } = Dimensions.get("window")

type UserInfoScreenProps = MainScreenProps<"UserInfo">

type FieldName = "fullName" | "userId" | "idNumber" | "email" | "phone" | "department" | "city" | "birthDate" | "gender"

const UserInfoScreen: React.FC<UserInfoScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const [fullName, setFullName] = useState<string>("Usuario Demo")
  const [userId, setUserId] = useState<string>("user123")
  const [idNumber, setIdNumber] = useState<string>("1234567890")
  const [email, setEmail] = useState<string>("usuario@ejemplo.com")
  const [phone, setPhone] = useState<string>("+57 300 123 4567")
  const [department, setDepartment] = useState<string>("Antioquia")
  const [city, setCity] = useState<string>("Medellín")
  const [successModalVisible, setSuccessModalVisible] = useState<boolean>(false)

  // Estado para la fecha de nacimiento
  const [dateText, setDateText] = useState<string>("01/01/1990")
  const [showDateModal, setShowDateModal] = useState<boolean>(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(1)
  const [selectedMonth, setSelectedMonth] = useState<string | null>("Enero")
  const [selectedYear, setSelectedYear] = useState<number | null>(1990)

  // Estado para el género
  const [gender, setGender] = useState<string>("Prefiero no decirlo")
  const [showGenderModal, setShowGenderModal] = useState<boolean>(false)
  const [selectedGenderId, setSelectedGenderId] = useState<string | null>("other")
  const [fadeAnim] = useState(new Animated.Value(0))

  // Estado para el selector de avatar
  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false)
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarInfo | null>(null)
  const [avatars, setAvatars] = useState<AvatarInfo[]>([])

  // Cargar avatares y avatar seleccionado al iniciar
  useEffect(() => {
    const loadAvatars = async () => {
      // Obtener todos los avatares disponibles
      const allAvatars = getAllAvatars()
      setAvatars(allAvatars)

      // Obtener el avatar seleccionado
      const currentAvatar = await getSelectedAvatar()
      setSelectedAvatar(currentAvatar)
    }

    loadAvatars()
  }, [])

  // Definir qué campos son editables y cuáles no
  const fieldConfig: Record<FieldName, { editable: boolean }> = {
    fullName: { editable: false },
    userId: { editable: false },
    idNumber: { editable: false },
    email: { editable: true },
    phone: { editable: true },
    department: { editable: false },
    city: { editable: false },
    birthDate: { editable: false },
    gender: { editable: true },
  }

  // Función para aplicar estilos según si el campo es editable o no
  const getInputStyle = (fieldName: FieldName) => {
    return [styles.input, !fieldConfig[fieldName].editable && styles.readOnlyInput]
  }

  const genderOptions = [
    { id: "male", label: "Hombre" },
    { id: "female", label: "Mujer" },
    { id: "other", label: "Prefiero no decirlo" },
  ]

  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)

  const handleBack = (): void => {
    // Navegar explícitamente a SettingsScreen en lugar de usar goBack
    navigation.navigate("Settings")
  }

  const handleSaveChanges = async (): Promise<void> => {
    if (!selectedAvatar) return

    try {
      // Guardar el avatar seleccionado
      await saveSelectedAvatar(selectedAvatar)

      // Crear un objeto con solo los campos editables
      const editableData = {
        ...(fieldConfig.email.editable ? { email } : {}),
        ...(fieldConfig.phone.editable ? { phone } : {}),
        ...(fieldConfig.gender.editable ? { gender } : {}),
        avatar: selectedAvatar.id,
      }

      console.log("Datos a enviar al backend:", editableData)

      // Mostrar el modal de éxito
      setSuccessModalVisible(true)
    } catch (error) {
      console.error("Error al guardar cambios:", error)
      Alert.alert("Error", "No se pudieron guardar los cambios. Intenta nuevamente.")
    }
  }

  // Función para abrir el modal de género con animación
  const openGenderModal = () => {
    if (!fieldConfig.gender.editable) return

    setShowGenderModal(true)
    fadeAnim.setValue(0)
    Animated.spring(fadeAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start()
  }

  // Manejador para seleccionar género
  const handleSelectGender = (option: { id: string; label: string }): void => {
    setSelectedGenderId(option.id)
    setGender(option.label)

    // Animación de salida
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowGenderModal(false)
      // Resetear la animación para la próxima vez
      fadeAnim.setValue(0)
    })
  }

  const handleConfirmDate = (): void => {
    if (selectedDay && selectedMonth && selectedYear) {
      const monthIndex = months.indexOf(selectedMonth) + 1
      const formattedDay = String(selectedDay).padStart(2, "0")
      const formattedMonth = String(monthIndex).padStart(2, "0")
      setDateText(`${formattedDay}/${formattedMonth}/${selectedYear}`)
      setShowDateModal(false)
    } else {
      Alert.alert("Error", "Por favor, selecciona un día, mes y año.")
    }
  }

  // Función para seleccionar un avatar
  const handleSelectAvatar = async (avatar: AvatarInfo): Promise<void> => {
    setSelectedAvatar(avatar)
    setShowAvatarModal(false)
  }

  // Función para cerrar el modal de éxito y volver a la pantalla anterior
  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false)
    // Navegar explícitamente a SettingsScreen en lugar de usar goBack
    navigation.navigate("Settings")
  }

  // Renderizar un item de avatar
  const renderAvatarItem = ({ item }: { item: AvatarInfo }) => (
    <TouchableOpacity
      style={[styles.avatarItem, selectedAvatar?.id === item.id && styles.selectedAvatarItem]}
      onPress={() => handleSelectAvatar(item)}
    >
      <Image source={item.source} style={styles.avatarItemImage} />
      <Text style={styles.avatarItemName}>{item.name}</Text>
      {selectedAvatar?.id === item.id && (
        <View style={styles.selectedAvatarIndicator}>
          <Text style={styles.selectedAvatarIndicatorText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ebebeb" />
      <ImageBackground
        source={require("src/assets/images/Fondo10_FORTU.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          {/* Botón de retroceso */}
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Image
              source={require("src/assets/images/back_button.png")}
              style={styles.backButtonImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Título */}
          <Text style={styles.title}>Tu info</Text>

          {/* Sección de Avatar */}
          <View style={styles.avatarSection}>
            <TouchableOpacity style={styles.avatarContainer} onPress={() => setShowAvatarModal(true)}>
              {selectedAvatar && <Image source={selectedAvatar.source} style={styles.avatarImage} resizeMode="cover" />}
              <View style={styles.avatarEditOverlay}>
                <Text style={styles.avatarEditText}>Cambiar</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.avatarTextContainer}>
              <Text style={styles.avatarTitle}>Avatar</Text>
              <Text style={styles.avatarSubtitle}>Selecciona tu avatar</Text>
            </View>
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
            {/* Nombre completo */}
            <Text style={styles.inputLabel}>Nombre completo*</Text>
            <TextInput
              style={getInputStyle("fullName")}
              placeholder=""
              value={fullName}
              onChangeText={setFullName}
              editable={fieldConfig.fullName.editable}
            />
            <Text style={styles.inputHelp}>Tu nombre no se mostrará en Fortu.</Text>

            {/* ID de usuario */}
            <Text style={styles.inputLabel}>ID de usuario</Text>
            <TextInput
              style={getInputStyle("userId")}
              placeholder=""
              value={userId}
              onChangeText={setUserId}
              editable={fieldConfig.userId.editable}
            />
            <Text style={styles.inputHelp}>Este código será visible publicamente.</Text>

            {/* Cédula de ciudadanía */}
            <Text style={styles.inputLabel}>Cédula de ciudadanía*</Text>
            <TextInput
              style={getInputStyle("idNumber")}
              placeholder=""
              keyboardType="numeric"
              value={idNumber}
              onChangeText={setIdNumber}
              editable={fieldConfig.idNumber.editable}
            />
            <Text style={styles.inputHelp}>Nos ayudará a verificar tu identidad.</Text>

            {/* Correo electrónico */}
            <Text style={styles.inputLabel}>Correo electrónico*</Text>
            <TextInput
              style={getInputStyle("email")}
              placeholder=""
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={fieldConfig.email.editable}
            />
            <Text style={styles.inputHelp}>Nunca compartiremos tu correo electrónico con nadie más.</Text>

            {/* Número de contacto */}
            <Text style={styles.inputLabel}>Número de contacto*</Text>
            <TextInput
              style={getInputStyle("phone")}
              placeholder=""
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              editable={fieldConfig.phone.editable}
            />
            <Text style={styles.inputHelp}></Text>

            {/* Departamento y Ciudad en la misma fila */}
            <View style={styles.rowContainer}>
              <View style={styles.halfInputContainer}>
                <Text style={styles.inputLabel}>Departamento*</Text>
                <TextInput
                  style={getInputStyle("department")}
                  placeholder=""
                  value={department}
                  onChangeText={setDepartment}
                  editable={fieldConfig.department.editable}
                />
              </View>
              <View style={styles.halfInputContainer}>
                <Text style={styles.inputLabel}>Ciudad*</Text>
                <TextInput
                  style={getInputStyle("city")}
                  placeholder=""
                  value={city}
                  onChangeText={setCity}
                  editable={fieldConfig.city.editable}
                />
              </View>
            </View>
            <Text style={styles.inputHelp}></Text>

            {/* Fecha de nacimiento y Género en la misma fila */}
            <View style={styles.rowContainer}>
              <View style={styles.halfInputContainer}>
                <Text style={styles.inputLabel}>Fecha de nacimiento*</Text>
                <TouchableOpacity
                  style={getInputStyle("birthDate")}
                  onPress={() => fieldConfig.birthDate.editable && setShowDateModal(true)}
                  disabled={!fieldConfig.birthDate.editable}
                >
                  <Text style={dateText ? styles.inputText : styles.placeholderText}>{dateText || "DD/MM/AAAA"}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.halfInputContainer}>
                <Text style={styles.inputLabel}>Género</Text>
                <TouchableOpacity
                  style={styles.selectInput}
                  onPress={openGenderModal}
                  disabled={!fieldConfig.gender.editable}
                >
                  <Text style={gender ? styles.inputText : styles.placeholderText}>{gender || "Seleccionar"}</Text>
                  <Text style={styles.selectArrow}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.inputHelp}></Text>

            {/* Botón de guardar cambios */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
              <Text style={styles.saveButtonText}>Guardar cambios</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Modal para selección de avatar */}
        <Modal visible={showAvatarModal} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.avatarModalContent}>
              <Text style={styles.modalTitle}>Selecciona tu avatar</Text>

              <FlatList
                data={avatars}
                renderItem={renderAvatarItem}
                keyExtractor={(item) => item.id}
                numColumns={3}
                contentContainerStyle={styles.avatarGrid}
                showsVerticalScrollIndicator={true}
                initialNumToRender={15}
                maxToRenderPerBatch={15}
                windowSize={21}
              />

              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowAvatarModal(false)}>
                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal mejorado para selección de género */}
        <Modal visible={showGenderModal} transparent={true} animationType="fade">
          <View style={styles.modalContainer}>
            <Animated.View
              style={[
                styles.genderModalContent,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
                },
              ]}
            >
              <View style={styles.genderModalHeader}>
                <Text style={styles.genderModalTitle}>Selecciona tu género</Text>
                <View style={styles.genderModalDivider} />
              </View>

              <View style={styles.genderOptionsContainer}>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[styles.genderOption, selectedGenderId === option.id && styles.genderOptionSelected]}
                    onPress={() => handleSelectGender(option)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.genderOptionText,
                        selectedGenderId === option.id && styles.genderOptionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {selectedGenderId === option.id && (
                      <View style={styles.genderCheckmark}>
                        <Text style={styles.genderCheckmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.genderModalFooter}>
                <TouchableOpacity
                  style={styles.genderModalCancelButton}
                  onPress={() => {
                    Animated.timing(fadeAnim, {
                      toValue: 0,
                      duration: 200,
                      useNativeDriver: true,
                    }).start(() => {
                      setShowGenderModal(false)
                      fadeAnim.setValue(0)
                    })
                  }}
                >
                  <Text style={styles.genderModalCancelText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>

        {/* Modal para selección de fecha */}
        <Modal visible={showDateModal} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecciona tu fecha de nacimiento</Text>

              <View style={styles.datePickerContainer}>
                {/* Selector de día */}
                <View style={styles.datePickerColumn}>
                  <Text style={styles.datePickerLabel}>Día</Text>
                  <ScrollView style={styles.datePickerScroll}>
                    {days.map((day) => (
                      <TouchableOpacity
                        key={`day-${day}`}
                        style={[styles.datePickerItem, selectedDay === day && styles.datePickerItemSelected]}
                        onPress={() => setSelectedDay(day)}
                      >
                        <Text
                          style={[styles.datePickerItemText, selectedDay === day && styles.datePickerItemTextSelected]}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Selector de mes */}
                <View style={styles.datePickerColumn}>
                  <Text style={styles.datePickerLabel}>Mes</Text>
                  <ScrollView style={styles.datePickerScroll}>
                    {months.map((month) => (
                      <TouchableOpacity
                        key={`month-${month}`}
                        style={[styles.datePickerItem, selectedMonth === month && styles.datePickerItemSelected]}
                        onPress={() => setSelectedMonth(month)}
                      >
                        <Text
                          style={[
                            styles.datePickerItemText,
                            selectedMonth === month && styles.datePickerItemTextSelected,
                          ]}
                        >
                          {month}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Selector de año */}
                <View style={styles.datePickerColumn}>
                  <Text style={styles.datePickerLabel}>Año</Text>
                  <ScrollView style={styles.datePickerScroll}>
                    {years.map((year) => (
                      <TouchableOpacity
                        key={`year-${year}`}
                        style={[styles.datePickerItem, selectedYear === year && styles.datePickerItemSelected]}
                        onPress={() => setSelectedYear(year)}
                      >
                        <Text
                          style={[
                            styles.datePickerItemText,
                            selectedYear === year && styles.datePickerItemTextSelected,
                          ]}
                        >
                          {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity style={styles.modalCancelButton} onPress={() => setShowDateModal(false)}>
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalConfirmButton} onPress={handleConfirmDate}>
                  <Text style={styles.modalConfirmText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal de éxito mejorado */}
        <SuccessModal
          visible={successModalVisible}
          title="¡Cambios guardados!"
          message="Tu información ha sido actualizada correctamente."
          buttonText="Aceptar"
          onClose={handleSuccessModalClose}
        />
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebebeb",
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  backButton: {
    marginTop: 40,
    marginLeft: 20,
    marginBottom: 20,
  },
  backButtonImage: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#3f3f3f",
    marginBottom: 30,
    marginLeft: 30,
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginLeft: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    marginRight: 20,
    position: "relative",
    backgroundColor: "#f0f0f0", // Fondo para cuando no hay avatar
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarEditOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 5,
    alignItems: "center",
  },
  avatarEditText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  avatarTextContainer: {
    justifyContent: "center",
  },
  avatarTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2262ce",
    marginBottom: 5,
  },
  avatarSubtitle: {
    fontSize: 16,
    color: "#7f7f7f",
  },
  formContainer: {
    paddingHorizontal: 40,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#595959",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 5,
    fontSize: 16,
    justifyContent: "center",
  },
  inputText: {
    fontSize: 16,
    color: "#3f3f3f",
  },
  placeholderText: {
    fontSize: 16,
    color: "#bcbcbc",
  },
  inputHelp: {
    fontSize: 14,
    color: "#7f7f7f",
    marginBottom: 15,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInputContainer: {
    width: "48%",
  },
  selectInput: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectText: {
    fontSize: 16,
    color: "#bcbcbc",
  },
  selectArrow: {
    fontSize: 16,
    color: "#595959",
  },
  saveButton: {
    backgroundColor: "#59cdf2",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  readOnlyInput: {
    backgroundColor: "#f5f5f5",
    color: "#666666",
  },
  // Estilos para el modal de fecha
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3f3f3f",
    marginBottom: 20,
    textAlign: "center",
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  datePickerColumn: {
    width: "30%",
  },
  datePickerLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#595959",
    marginBottom: 5,
    textAlign: "center",
  },
  datePickerScroll: {
    height: 150,
  },
  datePickerItem: {
    paddingVertical: 10,
    alignItems: "center",
  },
  datePickerItemSelected: {
    backgroundColor: "#59cdf2",
    borderRadius: 8,
  },
  datePickerItemText: {
    fontSize: 16,
    color: "#3f3f3f",
  },
  datePickerItemTextSelected: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalCancelButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#ebebeb",
    borderRadius: 20,
  },
  modalCancelText: {
    fontSize: 16,
    color: "#3f3f3f",
    fontWeight: "bold",
  },
  modalConfirmButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#59cdf2",
    borderRadius: 20,
  },
  modalConfirmText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
  },
  // Estilos mejorados para el modal de género
  genderModalContent: {
    width: "85%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  genderModalHeader: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 0,
    alignItems: "center",
  },
  genderModalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2262ce",
    textAlign: "center",
    marginBottom: 10,
  },
  genderModalDivider: {
    height: 4,
    width: 60,
    backgroundColor: "#59cdf2",
    borderRadius: 2,
  },
  genderOptionsContainer: {
    padding: 20,
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    position: "relative",
  },
  genderOptionSelected: {
    backgroundColor: "#f0f9fd",
  },
  genderOptionText: {
    fontSize: 18,
    color: "#3f3f3f",
  },
  genderOptionTextSelected: {
    color: "#2262ce",
    fontWeight: "bold",
  },
  genderCheckmark: {
    position: "absolute",
    right: 20,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#59cdf2",
    justifyContent: "center",
    alignItems: "center",
  },
  genderCheckmarkText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  genderModalFooter: {
    padding: 20,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  genderModalCancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    backgroundColor: "#59cdf2",
  },
  genderModalCancelText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Estilos para el selector de avatar
  avatarModalContent: {
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    maxHeight: "80%",
  },
  avatarGrid: {
    paddingVertical: 10,
  },
  avatarItem: {
    width: (width - 80) / 3 - 10,
    margin: 5,
    alignItems: "center",
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ebebeb",
    position: "relative",
  },
  selectedAvatarItem: {
    borderColor: "#59cdf2",
    borderWidth: 2,
    backgroundColor: "#f0f9fd",
  },
  avatarItemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  avatarItemName: {
    fontSize: 10,
    color: "#3f3f3f",
    textAlign: "center",
  },
  selectedAvatarIndicator: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#59cdf2",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedAvatarIndicatorText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalCloseButton: {
    backgroundColor: "#59cdf2",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: "center",
    marginTop: 20,
  },
  modalCloseButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default UserInfoScreen
