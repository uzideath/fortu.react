"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Dimensions,
  ImageBackground,
  StatusBar,
  Modal,
} from "react-native"
import { colors } from "src/styles/colors"
import { isValidEmail } from "src/utils/helpers"
import LoginErrorModal from "src/components/modals/LoginErrorModal"
import CustomCheckbox from "src/components/common/CustomCheckbox"
import Ionicons from "react-native-vector-icons/Ionicons"
import TermsConditionsModal from "src/components/modals/TermsConditionsModal"
import PrivacyPolicyModal from "src/components/modals/PrivacyPolicyModal"
import { normalizeText } from "@/lib/utils"
import { ciudadesPorDepartamento, departamentos } from "@/lib/departments"
import { RegisterScreenProps, LocationItem, PasswordRequirement } from "@/types/types"
const { width, height } = Dimensions.get("window")

// Pre-normalizar todas las ciudades
Object.keys(ciudadesPorDepartamento).forEach((key) => {
  ciudadesPorDepartamento[key] = ciudadesPorDepartamento[key].map((item) => ({
    ...item,
    normalizedLabel: normalizeText(item.label),
  }))
})

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [idNumber, setIdNumber] = useState<string>("")
  const [birthDate, setBirthDate] = useState<string>("")

  // Estados para los inputs de ubicación
  const [departamento, setDepartamento] = useState<string>("")
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState<string | null>(null)
  const [showDepartamentoSuggestions, setShowDepartamentoSuggestions] = useState<boolean>(false)
  const [departamentoSuggestions, setDepartamentoSuggestions] = useState<LocationItem[]>([])
  const [departamentoLabel, setDepartamentoLabel] = useState<string>("")

  const [ciudad, setCiudad] = useState<string>("")
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<string | null>(null)
  const [showCiudadSuggestions, setShowCiudadSuggestions] = useState<boolean>(false)
  const [ciudadSuggestions, setCiudadSuggestions] = useState<LocationItem[]>([])
  const [ciudadLabel, setCiudadLabel] = useState<string>("")

  const [email, setEmail] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false)
  const [privacyAccepted, setPrivacyAccepted] = useState<boolean>(false)
  const [ageConfirmed, setAgeConfirmed] = useState<boolean>(false)
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  // Estados para los modales de términos y condiciones y política de privacidad
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false)

  // Modales para selección
  const [showDepartamentoModal, setShowDepartamentoModal] = useState<boolean>(false)
  const [showCiudadModal, setShowCiudadModal] = useState<boolean>(false)

  const scrollViewRef = useRef<ScrollView>(null)
  const departamentoInputRef = useRef<TextInput>(null)
  const ciudadInputRef = useRef<TextInput>(null)

  // Filtrar sugerencias de departamentos con lógica mejorada
  useEffect(() => {
    if (departamento.length > 0) {
      const searchTerm = normalizeText(departamento)

      // Filtrar con múltiples estrategias para mayor flexibilidad
      const filteredSuggestions = departamentos.filter((item) => {
        const normalizedLabel = item.normalizedLabel || normalizeText(item.label)

        // 1. Coincidencia exacta (prioridad más alta)
        if (normalizedLabel === searchTerm) return true

        // 2. Comienza con el término de búsqueda
        if (normalizedLabel.startsWith(searchTerm)) return true

        // 3. Contiene el término de búsqueda
        if (normalizedLabel.includes(searchTerm)) return true

        // 4. Coincidencia por palabras individuales
        const words = normalizedLabel.split(" ")
        if (words.some((word) => word.startsWith(searchTerm))) return true

        // 5. Coincidencia por caracteres iniciales (para abreviaturas)
        if (searchTerm.length >= 2) {
          const initials = words.map((word) => word.charAt(0)).join("")
          if (initials.includes(searchTerm)) return true
        }

        return false
      })

      // Ordenar resultados por relevancia
      const sortedSuggestions = [...filteredSuggestions].sort((a, b) => {
        const aLabel = a.normalizedLabel || normalizeText(a.label)
        const bLabel = b.normalizedLabel || normalizeText(b.label)

        // Priorizar coincidencias exactas y que comienzan con el término
        if (aLabel.startsWith(searchTerm) && !bLabel.startsWith(searchTerm)) return -1
        if (!aLabel.startsWith(searchTerm) && bLabel.startsWith(searchTerm)) return 1

        // Luego ordenar por longitud (nombres más cortos primero)
        return aLabel.length - bLabel.length
      })

      setDepartamentoSuggestions(sortedSuggestions)
    } else {
      // Si el campo está vacío, mostrar todos los departamentos
      setDepartamentoSuggestions(departamentos)
    }
  }, [departamento])

  // Filtrar sugerencias de ciudades con lógica mejorada
  useEffect(() => {
    if (departamentoSeleccionado) {
      const ciudadesDisponibles = ciudadesPorDepartamento[departamentoSeleccionado] || []

      if (ciudad.length > 0) {
        const searchTerm = normalizeText(ciudad)

        // Aplicar la misma lógica de filtrado mejorada
        const filteredSuggestions = ciudadesDisponibles.filter((item) => {
          const normalizedLabel = item.normalizedLabel || normalizeText(item.label)

          if (normalizedLabel === searchTerm) return true
          if (normalizedLabel.startsWith(searchTerm)) return true
          if (normalizedLabel.includes(searchTerm)) return true

          const words = normalizedLabel.split(" ")
          if (words.some((word) => word.startsWith(searchTerm))) return true

          return false
        })

        // Ordenar por relevancia
        const sortedSuggestions = [...filteredSuggestions].sort((a, b) => {
          const aLabel = a.normalizedLabel || normalizeText(a.label)
          const bLabel = b.normalizedLabel || normalizeText(b.label)

          if (aLabel.startsWith(searchTerm) && !bLabel.startsWith(searchTerm)) return -1
          if (!aLabel.startsWith(searchTerm) && bLabel.startsWith(searchTerm)) return 1

          return aLabel.length - bLabel.length
        })

        setCiudadSuggestions(sortedSuggestions)
      } else {
        // Si el campo está vacío, mostrar todas las ciudades del departamento
        setCiudadSuggestions(ciudadesDisponibles)
      }
    } else {
      setCiudadSuggestions([])
    }
  }, [ciudad, departamentoSeleccionado])

  const handleDepartamentoSelect = (item: LocationItem) => {
    setDepartamento(item.label)
    setDepartamentoLabel(item.label)
    setDepartamentoSeleccionado(item.value)
    setShowDepartamentoModal(false)
    setCiudad("")
    setCiudadLabel("")
    setCiudadSeleccionada(null)

    // Enfocar automáticamente el campo de ciudad
    setTimeout(() => {
      if (ciudadInputRef.current) {
        ciudadInputRef.current.focus()
      }
    }, 100)
  }

  const handleCiudadSelect = (item: LocationItem) => {
    setCiudad(item.label)
    setCiudadLabel(item.label)
    setCiudadSeleccionada(item.value)
    setShowCiudadModal(false)
  }

  const passwordRequirements: PasswordRequirement[] = [
    {
      label: "Mínimo 8 caracteres",
      isValid: password.length >= 8,
      regex: /.{8,}/,
    },
    {
      label: "Al menos una letra mayúscula",
      isValid: /[A-Z]/.test(password),
      regex: /[A-Z]/,
    },
    {
      label: "Al menos un número",
      isValid: /[0-9]/.test(password),
      regex: /[0-9]/,
    },
    {
      label: "Al menos un carácter especial",
      isValid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      regex: /[!@#$%^&*(),.?":{}|<>]/,
    },
  ]

  const isPasswordValid = passwordRequirements.every((req) => req.isValid)

  // Función para formatear la fecha automáticamente mientras el usuario escribe
  const handleBirthDateChange = (text: string) => {
    // Eliminar cualquier carácter que no sea número
    const cleaned = text.replace(/[^0-9]/g, "")

    // Limitar a 8 dígitos (DDMMAAAA)
    const limited = cleaned.substring(0, 8)

    // Formatear con barras (DD/MM/AAAA)
    let formatted = ""
    if (limited.length > 0) {
      // Añadir los primeros dos dígitos (DD)
      formatted = limited.substring(0, 2)

      // Añadir barra y los siguientes dos dígitos (MM) si existen
      if (limited.length > 2) {
        formatted += "/" + limited.substring(2, 4)

        // Añadir barra y los últimos cuatro dígitos (AAAA) si existen
        if (limited.length > 4) {
          formatted += "/" + limited.substring(4, 8)
        }
      }
    }

    setBirthDate(formatted)
  }

  const handleRegister = (): void => {
    // Validación básica
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage("Por favor, ingresa tu nombre completo.")
      setShowErrorModal(true)
      return
    }

    if (!idNumber.trim()) {
      setErrorMessage("Por favor, ingresa tu número de identificación.")
      setShowErrorModal(true)
      return
    }

    if (!birthDate.trim()) {
      setErrorMessage("Por favor, ingresa tu fecha de nacimiento.")
      setShowErrorModal(true)
      return
    }

    if (!departamentoSeleccionado) {
      setErrorMessage("Por favor, selecciona tu departamento.")
      setShowErrorModal(true)
      return
    }

    if (!ciudadSeleccionada) {
      setErrorMessage("Por favor, selecciona tu ciudad.")
      setShowErrorModal(true)
      return
    }

    if (!isValidEmail(email)) {
      setErrorMessage("Por favor, ingresa un correo electrónico válido.")
      setShowErrorModal(true)
      return
    }

    if (!phone.trim()) {
      setErrorMessage("Por favor, ingresa tu número de celular.")
      setShowErrorModal(true)
      return
    }

    if (!isPasswordValid) {
      setErrorMessage("Por favor, ingresa una contraseña válida que cumpla con todos los requisitos.")
      setShowErrorModal(true)
      return
    }

    if (!termsAccepted) {
      setErrorMessage("Debes aceptar los términos y condiciones.")
      setShowErrorModal(true)
      return
    }

    if (!privacyAccepted) {
      setErrorMessage("Debes aceptar la política de privacidad.")
      setShowErrorModal(true)
      return
    }

    if (!ageConfirmed) {
      setErrorMessage("Debes confirmar que eres mayor de edad.")
      setShowErrorModal(true)
      return
    }

    // Navegar a la pantalla de bienvenida
    navigation.navigate("Welcome")
  }

  const handleLogin = (): void => {
    navigation.navigate("Login")
  }

  const handleGoogleLogin = (): void => {
    // Implementación futura de login con Google
    console.log("Login con Google")
  }

  const handleAppleLogin = (): void => {
    // Implementación futura de login con Apple
    console.log("Login con Apple")
  }

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword)
  }

  // Manejadores para los modales de términos y condiciones y política de privacidad
  const handleOpenTermsModal = () => {
    setShowTermsModal(true)
  }

  const handleCloseTermsModal = () => {
    setShowTermsModal(false)
  }

  const handleAcceptTerms = () => {
    setTermsAccepted(true)
    setShowTermsModal(false)
  }

  const handleOpenPrivacyModal = () => {
    setShowPrivacyModal(true)
  }

  const handleClosePrivacyModal = () => {
    setShowPrivacyModal(false)
  }

  const handleAcceptPrivacy = () => {
    setPrivacyAccepted(true)
    setShowPrivacyModal(false)
  }

  // Renderizar el modal de selección de departamento
  const renderDepartamentoModal = () => (
    <Modal
      visible={showDepartamentoModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowDepartamentoModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecciona un departamento</Text>
            <TouchableOpacity onPress={() => setShowDepartamentoModal(false)}>
              <Ionicons name="close" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.modalSearchInput}
            placeholder="Buscar departamento"
            placeholderTextColor="#B0C8EA"
            value={departamento}
            onChangeText={setDepartamento}
            autoCapitalize="words"
          />

          <ScrollView style={styles.modalList}>
            {departamentoSuggestions.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={styles.modalItem}
                onPress={() => handleDepartamentoSelect(item)}
              >
                <Text style={styles.modalItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )

  // Renderizar el modal de selección de ciudad
  const renderCiudadModal = () => (
    <Modal
      visible={showCiudadModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCiudadModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecciona una ciudad</Text>
            <TouchableOpacity onPress={() => setShowCiudadModal(false)}>
              <Ionicons name="close" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.modalSearchInput}
            placeholder="Buscar ciudad"
            placeholderTextColor="#B0C8EA"
            value={ciudad}
            onChangeText={setCiudad}
            autoCapitalize="words"
          />

          <ScrollView style={styles.modalList}>
            {ciudadSuggestions.map((item) => (
              <TouchableOpacity key={item.value} style={styles.modalItem} onPress={() => handleCiudadSelect(item)}>
                <Text style={styles.modalItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Fondo y logo fijo */}
      <ImageBackground
        source={require("src/assets/images/Fondo3_FORTU.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
            style={styles.keyboardAvoidingView}
          >
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={styles.scrollView}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              {/* Logo en la esquina superior izquierda */}
              <View style={styles.logoWrapper}>
                <View style={styles.logoContainer}>
                  <Image source={require("src/assets/images/logo_t.png")} style={styles.logo} resizeMode="contain" />
                </View>
              </View>

              <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>¡Hola!</Text>
                <Text style={styles.headerSubtitle}>Crear una cuenta nueva</Text>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.rowContainer}>
                  <View style={styles.halfInputContainer}>
                    <Text style={styles.inputLabel}>Nombres</Text>
                    <TextInput
                      style={styles.input}
                      placeholder=""
                      placeholderTextColor="#B0C8EA"
                      value={firstName}
                      onChangeText={setFirstName}
                      autoCapitalize="words"
                    />
                  </View>

                  <View style={styles.halfInputContainer}>
                    <Text style={styles.inputLabel}>Apellidos</Text>
                    <TextInput
                      style={styles.input}
                      placeholder=""
                      placeholderTextColor="#B0C8EA"
                      value={lastName}
                      onChangeText={setLastName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                <View style={styles.rowContainer}>
                  <View style={styles.halfInputContainer}>
                    <Text style={styles.inputLabel}># de Identificación</Text>
                    <TextInput
                      style={styles.input}
                      placeholder=""
                      placeholderTextColor="#B0C8EA"
                      value={idNumber}
                      onChangeText={setIdNumber}
                      keyboardType="number-pad"
                    />
                  </View>

                  <View style={styles.halfInputContainer}>
                    <Text style={styles.inputLabel}>Fecha de nacimiento</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="DD/MM/AAAA"
                      placeholderTextColor="#B0C8EA"
                      value={birthDate}
                      onChangeText={handleBirthDateChange}
                      keyboardType="number-pad"
                      maxLength={10} // DD/MM/AAAA = 10 caracteres
                    />
                  </View>
                </View>

                <View style={styles.rowContainer}>
                  <View style={styles.halfInputContainer}>
                    <Text style={styles.inputLabel}>Departamento</Text>
                    <TouchableOpacity
                      style={styles.selectInput}
                      onPress={() => {
                        setShowDepartamentoModal(true)
                      }}
                    >
                      <Text style={[styles.selectInputText, !departamentoLabel && { color: "#B0C8EA" }]}>
                        {departamentoLabel || ""}
                      </Text>
                      <Ionicons name="chevron-down" size={20} color="#B0C8EA" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.halfInputContainer}>
                    <Text style={styles.inputLabel}>Ciudad</Text>
                    <TouchableOpacity
                      style={[styles.selectInput, !departamentoSeleccionado && styles.disabledInput]}
                      onPress={() => {
                        if (departamentoSeleccionado) {
                          setShowCiudadModal(true)
                        }
                      }}
                      disabled={!departamentoSeleccionado}
                    >
                      <Text style={[styles.selectInputText, !ciudadLabel && { color: "#B0C8EA" }]}>
                        {ciudadLabel || ""}
                      </Text>
                      <Ionicons name="chevron-down" size={20} color="#B0C8EA" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.fullInputContainer}>
                  <Text style={styles.inputLabel}>Correo electrónico</Text>
                  <TextInput
                    style={styles.input}
                    placeholder=""
                    placeholderTextColor="#B0C8EA"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.fullInputContainer}>
                  <Text style={styles.inputLabel}>Celular</Text>
                  <TextInput
                    style={styles.input}
                    placeholder=""
                    placeholderTextColor="#B0C8EA"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.fullInputContainer}>
                  <Text style={styles.inputLabel}>Contraseña</Text>
                  <View style={styles.passwordInputContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder=""
                      placeholderTextColor="#B0C8EA"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                    />
                    <TouchableOpacity
                      style={styles.eyeIconContainer}
                      onPress={togglePasswordVisibility}
                      activeOpacity={0.7}
                    >
                      <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#B0C8EA" />
                    </TouchableOpacity>
                  </View>
                </View>

                {(passwordFocused || password.length > 0) && (
                  <View style={styles.passwordRequirementsContainer}>
                    {passwordRequirements.map((requirement, index) => (
                      <View key={index} style={styles.passwordRequirementItem}>
                        <View style={[styles.checkCircle, requirement.isValid && styles.checkCircleFilled]}>
                          {requirement.isValid && <Text style={styles.checkMark}>✓</Text>}
                        </View>
                        <Text
                          style={[
                            styles.passwordRequirementText,
                            { color: requirement.isValid ? colors.primary : "#666666" },
                          ]}
                        >
                          {requirement.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                <CustomCheckbox
                  checked={termsAccepted}
                  onPress={handleOpenTermsModal}
                  label={
                    <Text style={styles.checkboxText}>
                      He leído y acepto los{" "}
                      <Text style={styles.checkboxLink} onPress={handleOpenTermsModal}>
                        términos y condiciones
                      </Text>
                    </Text>
                  }
                  containerStyle={styles.checkboxContainer}
                />

                <CustomCheckbox
                  checked={privacyAccepted}
                  onPress={handleOpenPrivacyModal}
                  label={
                    <Text style={styles.checkboxText}>
                      He leído y acepto la{" "}
                      <Text style={styles.checkboxLink} onPress={handleOpenPrivacyModal}>
                        política de privacidad y tratamiento de datos
                      </Text>
                    </Text>
                  }
                  containerStyle={styles.checkboxContainer}
                />

                <CustomCheckbox
                  checked={ageConfirmed}
                  onPress={() => setAgeConfirmed(!ageConfirmed)}
                  label={<Text style={styles.checkboxText}>Confirmo que soy mayor de edad</Text>}
                  containerStyle={styles.checkboxContainer}
                />

                <View style={styles.socialButtonsContainer}>
                  <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
                    <Image
                      source={require("src/assets/images/google_logo.jpg")}
                      style={styles.socialLogo}
                      resizeMode="contain"
                    />
                    <Text style={styles.socialButtonText}>Continuar con google</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.socialButton} onPress={handleAppleLogin}>
                    <Image
                      source={require("src/assets/images/apple_logo.png")}
                      style={styles.socialLogo}
                      resizeMode="contain"
                    />
                    <Text style={styles.socialButtonText}>Continuar AppleID</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.continueButton} onPress={handleRegister} activeOpacity={0.7}>
                  <Image source={require("src/assets/images/arrow_right.png")} style={styles.arrowIcon} />
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>¿Ya tienes una cuenta en Fortu?</Text>
                  <TouchableOpacity onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Inicia Sesión</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>

      {/* Modales para selección */}
      {renderDepartamentoModal()}
      {renderCiudadModal()}

      {/* Modal de términos y condiciones */}
      <TermsConditionsModal visible={showTermsModal} onClose={handleCloseTermsModal} onAccept={handleAcceptTerms} />

      {/* Modal de política de privacidad */}
      <PrivacyPolicyModal visible={showPrivacyModal} onClose={handleClosePrivacyModal} onAccept={handleAcceptPrivacy} />

      <LoginErrorModal visible={showErrorModal} onClose={() => setShowErrorModal(false)} message={errorMessage} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 20,
    alignItems: "center",
  },
  // Contenedor para posicionar el logo en la esquina superior izquierda
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
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 24,
    color: "#FFFFFF",
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 20,
    width: width * 0.9,
    maxWidth: 500,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  halfInputContainer: {
    width: "48%",
  },
  fullInputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#D1DFFA",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: colors.text.primary,
  },
  // Estilos para los inputs de selección
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
  // Estilos para el modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: width * 0.9,
    maxHeight: height * 0.7,
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
    maxHeight: height * 0.5,
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
  // Estilos para el campo de contraseña con icono de ojo
  passwordInputContainer: {
    flexDirection: "row",
    backgroundColor: "#D1DFFA",
    borderRadius: 10,
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: colors.text.primary,
  },
  eyeIconContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  passwordRequirementsContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#EFF4FF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1DFFA",
  },
  passwordRequirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#666666",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkCircleFilled: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkMark: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  passwordRequirementText: {
    fontSize: 14,
    fontWeight: "500",
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
  loginContainer: {
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 5,
  },
  loginButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
})

export default RegisterScreen
