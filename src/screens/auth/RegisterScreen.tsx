import React, { useState, useRef } from "react"
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ImageBackground, StatusBar, Dimensions } from "react-native"
import axios from "axios"
import { isValidEmail } from "src/utils/helpers"
import { RegisterScreenProps } from "@/types/types"
import TermsConditionsModal from "src/components/modals/TermsConditionsModal"
import PrivacyPolicyModal from "src/components/modals/PrivacyPolicyModal"
import CheckboxGroup from "@/components/auth/register/CheckboxGroup"
import ContinueButton from "@/components/auth/register/ContinueButton"
import FormInput from "@/components/auth/register/FormInput"
import FormRow from "@/components/auth/register/FormRow"
import LocationSelector from "@/components/auth/register/LocationSelector"
import LoginPrompt from "@/components/auth/register/LoginPrompt"
import Logo from "@/components/auth/register/Logo"
import PasswordInput from "@/components/auth/register/PasswordInput"
import SocialButtons from "@/components/auth/register/SocialButtons"
import DatePicker from "@/components/common/DatePicker"
import ErrorModal from "@/components/modals/ErrorModal"
import Header from "@/components/auth/register/Header"
import api from "@/lib/axios"
const { width } = Dimensions.get("window")

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    departamento: "",
    departamentoLabel: "",
    departamentoSeleccionado: null,
    ciudad: "",
    ciudadLabel: "",
    ciudadSeleccionada: null,
    email: "",
    phone: "",
    password: ""
  })
  
  // Date state - separate from other form data
  const [birthDate, setBirthDate] = useState<Date | null>(null)
  
  // UI state
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Checkbox state
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  
  // Modal state
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  
  const scrollViewRef = useRef<ScrollView>(null)

  // Update form data
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Handle date change
  const handleDateChange = (date: Date) => {
    setBirthDate(date)
  }

  // Handle location selection
  const handleDepartamentoSelect = (item: any) => {
    updateFormData("departamento", item.label)
    updateFormData("departamentoLabel", item.label)
    updateFormData("departamentoSeleccionado", item.value)
    updateFormData("ciudad", "")
    updateFormData("ciudadLabel", "")
    updateFormData("ciudadSeleccionada", null)
  }

  const handleCiudadSelect = (item: any) => {
    updateFormData("ciudad", item.label)
    updateFormData("ciudadLabel", item.label)
    updateFormData("ciudadSeleccionada", item.value)
  }

  // Password requirements
  const passwordRequirements = [
    {
      label: "Mínimo 8 caracteres",
      isValid: formData.password.length >= 8,
      regex: /.{8,}/,
    },
    {
      label: "Al menos una letra mayúscula",
      isValid: /[A-Z]/.test(formData.password),
      regex: /[A-Z]/,
    },
    {
      label: "Al menos un número",
      isValid: /[0-9]/.test(formData.password),
      regex: /[0-9]/,
    },
    {
      label: "Al menos un carácter especial",
      isValid: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
      regex: /[!@#$%^&*(),.?":{}|<>]/,
    },
  ]

  const isPasswordValid = passwordRequirements.every((req) => req.isValid)

  // Form validation
  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMessage("Por favor, ingresa tu nombre completo.")
      setShowErrorModal(true)
      return false
    }

    if (!formData.idNumber.trim()) {
      setErrorMessage("Por favor, ingresa tu número de identificación.")
      setShowErrorModal(true)
      return false
    }

    if (!birthDate) {
      setErrorMessage("Por favor, selecciona tu fecha de nacimiento.")
      setShowErrorModal(true)
      return false
    }

    if (!formData.departamentoSeleccionado) {
      setErrorMessage("Por favor, selecciona tu departamento.")
      setShowErrorModal(true)
      return false
    }

    if (!formData.ciudadSeleccionada) {
      setErrorMessage("Por favor, selecciona tu ciudad.")
      setShowErrorModal(true)
      return false
    }

    if (!isValidEmail(formData.email)) {
      setErrorMessage("Por favor, ingresa un correo electrónico válido.")
      setShowErrorModal(true)
      return false
    }

    if (!formData.phone.trim()) {
      setErrorMessage("Por favor, ingresa tu número de celular.")
      setShowErrorModal(true)
      return false
    }

    if (!isPasswordValid) {
      setErrorMessage("Por favor, ingresa una contraseña válida que cumpla con todos los requisitos.")
      setShowErrorModal(true)
      return false
    }

    if (!termsAccepted) {
      setErrorMessage("Debes aceptar los términos y condiciones.")
      setShowErrorModal(true)
      return false
    }

    if (!privacyAccepted) {
      setErrorMessage("Debes aceptar la política de privacidad.")
      setShowErrorModal(true)
      return false
    }

    if (!ageConfirmed) {
      setErrorMessage("Debes confirmar que eres mayor de edad.")
      setShowErrorModal(true)
      return false
    }

    return true
  }

  // Handle registration with axios
  const handleRegister = async () => {
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      // Prepare data for API - convert birthDate to ISO string
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        idNumber: formData.idNumber,
        birthDate: birthDate ? birthDate.toISOString() : null, // Convert to ISO string
        department: formData.departamentoSeleccionado,
        departmentName: formData.departamentoLabel,
        city: formData.ciudadSeleccionada,
        cityName: formData.ciudadLabel,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        termsAccepted,
        privacyAccepted,
        ageConfirmed
      }
      
      // Make API request
      const response = await api.post('/auth/register', userData)
      
      // Handle successful registration
      console.log('Registration successful:', response.data)
      
      // Navigate to main app
      navigation.navigate("MainApp")
    } catch (error) {
      // Handle error
      console.error('Registration error:', error)
      
      // Show error message
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message || "Error en el registro. Inténtalo de nuevo.")
      } else {
        setErrorMessage("Error de conexión. Por favor verifica tu conexión a internet.")
      }
      setShowErrorModal(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Navigation handlers
  const handleLogin = () => navigation.navigate("Login")
  const handleGoogleLogin = () => console.log("Login con Google")
  const handleAppleLogin = () => console.log("Login con Apple")

  // Modal handlers
  const handleOpenTermsModal = () => setShowTermsModal(true)
  const handleCloseTermsModal = () => setShowTermsModal(false)
  const handleAcceptTerms = () => {
    setTermsAccepted(true)
    setShowTermsModal(false)
  }

  const handleOpenPrivacyModal = () => setShowPrivacyModal(true)
  const handleClosePrivacyModal = () => setShowPrivacyModal(false)
  const handleAcceptPrivacy = () => {
    setPrivacyAccepted(true)
    setShowPrivacyModal(false)
  }

  // Calculate age restrictions for date picker
  const getMaximumDate = () => {
    // Set maximum date to today (can't select future dates)
    return new Date()
  }

  const getMinimumDate = () => {
    // Set minimum date to 100 years ago (reasonable age limit)
    const minDate = new Date()
    minDate.setFullYear(minDate.getFullYear() - 100)
    return minDate
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

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
              <Logo />
              <Header title="¡Hola!" subtitle="Crear una cuenta nueva" />

              <View style={styles.formContainer}>
                <FormRow>
                  <FormInput
                    label="Nombres"
                    value={formData.firstName}
                    onChangeText={(text) => updateFormData("firstName", text)}
                    containerStyle={styles.halfInputContainer}
                    autoCapitalize="words"
                  />
                  <FormInput
                    label="Apellidos"
                    value={formData.lastName}
                    onChangeText={(text) => updateFormData("lastName", text)}
                    containerStyle={styles.halfInputContainer}
                    autoCapitalize="words"
                  />
                </FormRow>

                <FormRow>
                  <FormInput
                    label="# de Identificación"
                    value={formData.idNumber}
                    onChangeText={(text) => updateFormData("idNumber", text)}
                    containerStyle={styles.halfInputContainer}
                    keyboardType="number-pad"
                  />
                  {/* Replace text input with DatePicker */}
                  <DatePicker
                    label="Fecha de nacimiento"
                    value={birthDate}
                    onChange={handleDateChange}
                    containerStyle={styles.halfInputContainer}
                    placeholder="Seleccionar fecha"
                    maximumDate={getMaximumDate()}
                    minimumDate={getMinimumDate()}
                  />
                </FormRow>

                <FormRow>
                  <LocationSelector
                    type="departamento"
                    label="Departamento"
                    value={formData.departamentoLabel}
                    onSelect={handleDepartamentoSelect}
                    containerStyle={styles.halfInputContainer}
                  />
                  <LocationSelector
                    type="ciudad"
                    label="Ciudad"
                    value={formData.ciudadLabel}
                    onSelect={handleCiudadSelect}
                    containerStyle={styles.halfInputContainer}
                    disabled={!formData.departamentoSeleccionado}
                    departmentId={formData.departamentoSeleccionado}
                  />
                </FormRow>

                <FormInput
                  label="Correo electrónico"
                  value={formData.email}
                  onChangeText={(text) => updateFormData("email", text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <FormInput
                  label="Celular"
                  value={formData.phone}
                  onChangeText={(text) => updateFormData("phone", text)}
                  keyboardType="phone-pad"
                />

                <PasswordInput
                  label="Contraseña"
                  value={formData.password}
                  onChangeText={(text) => updateFormData("password", text)}
                  showPassword={showPassword}
                  togglePasswordVisibility={() => setShowPassword(!showPassword)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  requirements={passwordRequirements}
                  showRequirements={passwordFocused || formData.password.length > 0}
                />

                <CheckboxGroup
                  items={[
                    {
                      checked: termsAccepted,
                      onPress: handleOpenTermsModal,
                      label: "He leído y acepto los términos y condiciones",
                      linkText: "términos y condiciones",
                      onLinkPress: handleOpenTermsModal
                    },
                    {
                      checked: privacyAccepted,
                      onPress: handleOpenPrivacyModal,
                      label: "He leído y acepto la política de privacidad y tratamiento de datos",
                      linkText: "política de privacidad y tratamiento de datos",
                      onLinkPress: handleOpenPrivacyModal
                    },
                    {
                      checked: ageConfirmed,
                      onPress: () => setAgeConfirmed(!ageConfirmed),
                      label: "Confirmo que soy mayor de edad"
                    }
                  ]}
                />

                <SocialButtons
                  onGooglePress={handleGoogleLogin}
                  onApplePress={handleAppleLogin}
                />

                <ContinueButton onPress={handleRegister} isLoading={isLoading} />

                <LoginPrompt onLoginPress={handleLogin} />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>

      <TermsConditionsModal 
        visible={showTermsModal} 
        onClose={handleCloseTermsModal} 
        onAccept={handleAcceptTerms} 
      />

      <PrivacyPolicyModal 
        visible={showPrivacyModal} 
        onClose={handleClosePrivacyModal} 
        onAccept={handleAcceptPrivacy} 
      />

      <ErrorModal 
        visible={showErrorModal} 
        onClose={() => setShowErrorModal(false)} 
        message={errorMessage} 
      />
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
  halfInputContainer: {
    width: "48%",
  },
})

export default RegisterScreen