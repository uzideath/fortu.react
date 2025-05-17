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
  ImageBackground,
  Animated,
  Dimensions,
  FlatList,
} from "react-native"
import type { MainScreenProps } from "src/types"
import { colors } from "src/styles/colors"
import { api } from "src/services/api"
import ErrorPaymentModal from "src/components/modals/ErrorPaymentModal"
import SuccessPaymentModal from "src/components/modals/SuccessPaymentModal"

type AddPaymentMethodScreenProps = MainScreenProps<"AddPaymentMethod">

// Tipos de tarjetas soportadas
type CardType = "visa" | "mastercard" | "amex" | "discover" | "unknown"

// Tipos de métodos de pago
type PaymentMethodType = "card" | "wompi" | "nequi"

const { width } = Dimensions.get("window")
const CARD_WIDTH = width - 40 // 20px padding on each side

const AddPaymentMethodScreen: React.FC<AddPaymentMethodScreenProps> = ({ navigation }) => {
  const [cardNumber, setCardNumber] = useState<string>("")
  const [cardHolder, setCardHolder] = useState<string>("")
  const [expiryDate, setExpiryDate] = useState<string>("")
  const [cvv, setCvv] = useState<string>("")
  const [saveCard, setSaveCard] = useState<boolean>(true) // Por defecto marcado
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [cardType, setCardType] = useState<CardType>("unknown")
  const [isCvvFocused, setIsCvvFocused] = useState<boolean>(false)
  const [isCardSaved, setIsCardSaved] = useState<boolean>(false)
  const [activePaymentMethod, setActivePaymentMethod] = useState<PaymentMethodType>("card")
  const [activeIndex, setActiveIndex] = useState<number>(0)

  // Referencia al FlatList para el deslizamiento
  const flatListRef = useRef<FlatList>(null)

  // Animación para el volteo de la tarjeta
  const flipAnimation = useRef(new Animated.Value(0)).current

  // Valores interpolados para la animación
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  })

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  })

  const frontOpacity = flipAnimation.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  })

  const backOpacity = flipAnimation.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
  })

  // Estilos para las caras de la tarjeta
  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
    opacity: frontOpacity,
  }

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
    opacity: backOpacity,
  }

  // Efecto para animar el volteo de la tarjeta
  useEffect(() => {
    Animated.timing(flipAnimation, {
      toValue: isCvvFocused ? 180 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }, [isCvvFocused, flipAnimation])

  const handleBack = (): void => {
    navigation.goBack()
  }

  // Función para detectar el tipo de tarjeta basado en los primeros dígitos
  const detectCardType = (number: string): CardType => {
    const cleanNumber = number.replace(/\D/g, "")
    console.log("Detectando tipo de tarjeta para:", cleanNumber)

    // Patrones de las tarjetas
    const patterns = {
      visa: /^4/,
      mastercard: /^(5[1-5]|2[2-7])/,
      amex: /^3[47]/,
      discover: /^(6011|65|64[4-9]|622)/,
    }

    if (patterns.visa.test(cleanNumber)) {
      console.log("Detectado: visa")
      return "visa"
    }
    if (patterns.mastercard.test(cleanNumber)) {
      console.log("Detectado: mastercard")
      return "mastercard"
    }
    if (patterns.amex.test(cleanNumber)) {
      console.log("Detectado: amex")
      return "amex"
    }
    if (patterns.discover.test(cleanNumber)) {
      console.log("Detectado: discover")
      return "discover"
    }

    console.log("Tipo de tarjeta desconocido")
    return "unknown"
  }

  // Obtener la imagen del logo según el tipo de tarjeta
  const getCardLogo = () => {
    switch (cardType) {
      case "visa":
        return require("src/assets/images/visa_logo.png")
      case "amex":
        return require("src/assets/images/amex_logo.png")
      case "mastercard":
        return require("src/assets/images/mastercard_logo.png")
      case "discover":
        return require("src/assets/images/mastercard_logo.png") // Usar mastercard como fallback para discover
      default:
        return null // Cambiado de mastercard a null para que no muestre logo por defecto
    }
  }

  // Obtener la imagen del logo para el input según el tipo de tarjeta
  const getInputCardLogo = () => {
    switch (cardType) {
      case "visa":
        return require("src/assets/images/visa_blue_logo.png")
      case "amex":
        return require("src/assets/images/amex_logo.png")
      case "mastercard":
        return require("src/assets/images/mastercard_logo.png")
      case "discover":
        return require("src/assets/images/mastercard_logo.png")
      default:
        return null // No mostrar logo si no se ha detectado el tipo
    }
  }

  const formatCardNumber = (text: string): string => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, "")

    // Formato diferente para American Express (4-6-5)
    if (cardType === "amex") {
      const parts = [cleaned.substring(0, 4), cleaned.substring(4, 10), cleaned.substring(10, 15)].filter(Boolean)
      return parts.join(" • ")
    }

    // Formato estándar para otras tarjetas (4-4-4-4)
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 • ")
    return formatted
  }

  const formatExpiryDate = (text: string): string => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, "")
    // Format as MM/YY
    if (cleaned.length > 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`
    }
    return cleaned
  }

  const handleCardNumberChange = (text: string): void => {
    // Detectar el tipo de tarjeta basado en los primeros dígitos
    const detectedType = detectCardType(text)
    setCardType(detectedType)

    // Formatear el número según el tipo de tarjeta
    const formatted = formatCardNumber(text)
    setCardNumber(formatted)
  }

  const handleExpiryDateChange = (text: string): void => {
    const formatted = formatExpiryDate(text)
    setExpiryDate(formatted)
  }

  const validateForm = (): boolean => {
    const cleanNumber = cardNumber.replace(/\s|•/g, "")

    // Validación específica según el tipo de tarjeta
    if (cardType === "amex") {
      if (cleanNumber.length !== 15) {
        setErrorMessage("El número de American Express debe tener 15 dígitos.")
        setShowErrorModal(true)
        return false
      }

      if (cvv.length !== 4) {
        setErrorMessage("El código de seguridad de American Express debe tener 4 dígitos.")
        setShowErrorModal(true)
        return false
      }
    } else {
      if (cleanNumber.length !== 16) {
        setErrorMessage("El número de tarjeta debe tener 16 dígitos.")
        setShowErrorModal(true)
        return false
      }

      if (cvv.length !== 3) {
        setErrorMessage("El código de seguridad debe tener 3 dígitos.")
        setShowErrorModal(true)
        return false
      }
    }

    if (!cardHolder.trim()) {
      setErrorMessage("Por favor, ingresa el nombre del titular.")
      setShowErrorModal(true)
      return false
    }

    if (!expiryDate.trim() || expiryDate.length !== 5) {
      setErrorMessage("Por favor, ingresa una fecha de expiración válida en formato MM/YY.")
      setShowErrorModal(true)
      return false
    }

    return true
  }

  // Función para obtener el número de tarjeta formateado para mostrar
  const getDisplayCardNumber = (): string => {
    if (isCardSaved) {
      // Si la tarjeta está guardada, mostrar solo los últimos 4 dígitos
      const cleanNumber = cardNumber.replace(/\s|•/g, "")
      const lastFourDigits = cleanNumber.slice(-4)

      if (cardType === "amex") {
        return `**** ****** ${lastFourDigits}`
      } else {
        return `**** **** **** ${lastFourDigits}`
      }
    } else {
      // Si la tarjeta no está guardada, mostrar el número completo o placeholder
      return cardNumber
    }
  }

  // Función para manejar el cierre del modal de éxito
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    navigation.navigate("Home")
  }

  // Modificar la función handleSave para asegurar que el tipo de tarjeta se guarde correctamente
  const handleSave = async (): Promise<void> => {
    if (activePaymentMethod === "card" && validateForm()) {
      try {
        setIsLoading(true)

        // Obtener los primeros dígitos para guardarlos (para detección futura)
        const cleanNumber = cardNumber.replace(/\s|•/g, "")
        const firstSixDigits = cleanNumber.substring(0, 6)

        // Asegurarse de que el tipo de tarjeta sea correcto
        console.log("AddPaymentMethodScreen: Tipo de tarjeta detectado:", cardType)

        // Crear objeto de tarjeta para guardar
        const paymentMethod = {
          name: `${cardType.charAt(0).toUpperCase() + cardType.slice(1)} terminada en ${cleanNumber.slice(-4)}`,
          icon: "💳",
          isDefault: saveCard, // Usar el valor del checkbox para determinar si es el método preferido
          number: cleanNumber.slice(-4), // Guardar los últimos 4 dígitos
          type: cardType, // Guardar el tipo de tarjeta
          firstDigits: firstSixDigits, // Guardar los primeros 6 dígitos para referencia
        }

        // Agregar un console.log para depuración
        console.log("AddPaymentMethodScreen: Guardando método de pago:", JSON.stringify(paymentMethod, null, 2))
        console.log("AddPaymentMethodScreen: Tipo de tarjeta a guardar:", cardType)

        // Guardar la tarjeta usando el API
        const savedMethod = await api.addPaymentMethod(paymentMethod)
        console.log("AddPaymentMethodScreen: Método guardado:", JSON.stringify(savedMethod, null, 2))
        console.log("AddPaymentMethodScreen: Tipo de tarjeta guardado:", savedMethod.type)

        // Marcar la tarjeta como guardada
        setIsCardSaved(true)

        // Mostrar el modal de éxito
        setShowSuccessModal(true)
      } catch (error) {
        console.error("Error al guardar la tarjeta:", error)
        setErrorMessage("Ocurrió un error al guardar la tarjeta. Inténtalo de nuevo.")
        setShowErrorModal(true)
      } finally {
        setIsLoading(false)
      }
    } else if (activePaymentMethod === "wompi") {
      try {
        setIsLoading(true)

        // Crear objeto de Wompi para guardar
        const paymentMethod = {
          name: "Wompi",
          icon: "🅿️",
          isDefault: saveCard,
          type: "wompi",
        }

        console.log("AddPaymentMethodScreen: Guardando Wompi:", JSON.stringify(paymentMethod, null, 2))

        // Guardar Wompi usando el API
        await api.addPaymentMethod(paymentMethod)

        // Mostrar el modal de éxito
        setShowSuccessModal(true)
      } catch (error) {
        console.error("Error al agregar Wompi:", error)
        setErrorMessage("Ocurrió un error al agregar Wompi. Inténtalo de nuevo.")
        setShowErrorModal(true)
      } finally {
        setIsLoading(false)
      }
    } else if (activePaymentMethod === "nequi") {
      try {
        setIsLoading(true)

        // Crear objeto de Nequi para guardar
        const paymentMethod = {
          name: "Nequi",
          icon: "📱",
          isDefault: saveCard,
          type: "nequi",
        }

        console.log("AddPaymentMethodScreen: Guardando Nequi:", JSON.stringify(paymentMethod, null, 2))

        // Guardar Nequi usando el API
        await api.addPaymentMethod(paymentMethod)

        // Mostrar el modal de éxito
        setShowSuccessModal(true)
      } catch (error) {
        console.error("Error al agregar Nequi:", error)
        setErrorMessage("Ocurrió un error al agregar Nequi. Inténtalo de nuevo.")
        setShowErrorModal(true)
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Ajustar el máximo de dígitos del CVV según el tipo de tarjeta
  const getCvvMaxLength = () => {
    return cardType === "amex" ? 4 : 3
  }

  // Placeholder para el CVV según el tipo de tarjeta
  const getCvvPlaceholder = () => {
    return cardType === "amex" ? "1234" : "123"
  }

  // Manejar el cambio de método de pago
  const handlePaymentMethodChange = (index: number) => {
    setActiveIndex(index)

    switch (index) {
      case 0:
        setActivePaymentMethod("card")
        break
      case 1:
        setActivePaymentMethod("wompi")
        break
      case 2:
        setActivePaymentMethod("nequi")
        break
      default:
        setActivePaymentMethod("card")
    }
  }

  // Función para manejar el deslizamiento a un método de pago específico
  const handleSlideToPaymentMethod = (method: PaymentMethodType) => {
    let index = 0

    switch (method) {
      case "card":
        index = 0
        break
      case "wompi":
        index = 1
        break
      case "nequi":
        index = 2
        break
    }

    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    })

    handlePaymentMethodChange(index)
  }

  // Renderizar el indicador de página actual
  const renderPaginationDots = () => {
    const dots = []
    const paymentMethods = ["card", "wompi", "nequi"]

    for (let i = 0; i < paymentMethods.length; i++) {
      dots.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleSlideToPaymentMethod(paymentMethods[i] as PaymentMethodType)}
          style={styles.paginationDotTouchable}
        >
          <View style={[styles.paginationDot, activeIndex === i ? styles.paginationDotActive : {}]} />
        </TouchableOpacity>,
      )
    }

    return <View style={styles.paginationContainer}>{dots}</View>
  }

  // Renderizar el formulario según el método de pago activo
  const renderPaymentMethodForm = () => {
    switch (activePaymentMethod) {
      case "card":
        return (
          <>
            {/* Card Number */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Número de tarjeta</Text>
              <View style={styles.cardNumberInputContainer}>
                <TextInput
                  style={styles.cardNumberInput}
                  placeholder="Ingresa el número de tarjeta"
                  placeholderTextColor="#999"
                  value={cardNumber}
                  onChangeText={handleCardNumberChange}
                  keyboardType="numeric"
                  maxLength={cardType === "amex" ? 17 : 25} // Ajustar según el tipo de tarjeta
                  onFocus={() => setIsCvvFocused(false)}
                  editable={!isCardSaved}
                />
                {cardType !== "unknown" && cardNumber && getInputCardLogo() && (
                  <Image source={getInputCardLogo()} style={styles.inputCardLogo} resizeMode="contain" />
                )}
              </View>
            </View>

            {/* Expiry Date and CVV */}
            <View style={styles.rowInputs}>
              <View style={styles.halfInputSection}>
                <Text style={styles.inputLabel}>Expira en</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  placeholderTextColor="#999"
                  value={expiryDate}
                  onChangeText={handleExpiryDateChange}
                  keyboardType="numeric"
                  maxLength={5} // MM/YY
                  onFocus={() => setIsCvvFocused(false)}
                  editable={!isCardSaved}
                />
              </View>

              <View style={styles.halfInputSection}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.input}
                  placeholder={getCvvPlaceholder()}
                  placeholderTextColor="#999"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                  maxLength={getCvvMaxLength()}
                  secureTextEntry={isCardSaved}
                  onFocus={() => setIsCvvFocused(true)}
                  onBlur={() => setIsCvvFocused(false)}
                  editable={!isCardSaved}
                />
              </View>
            </View>

            {/* Card Holder Name */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Nombre del titular</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre como aparece en la tarjeta"
                placeholderTextColor="#999"
                value={cardHolder}
                onChangeText={setCardHolder}
                autoCapitalize="words"
                onFocus={() => setIsCvvFocused(false)}
                editable={!isCardSaved}
              />
            </View>

            {/* Save Card Checkbox */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setSaveCard(!saveCard)}
              activeOpacity={0.7}
              disabled={isCardSaved}
            >
              <View style={styles.checkbox}>{saveCard && <View style={styles.checkboxInner} />}</View>
              <Text style={styles.checkboxLabel}>Agregar como método de pago preferido</Text>
            </TouchableOpacity>
          </>
        )
      case "wompi":
        return (
          <View style={styles.emptyFormContainer}>
            <Text style={styles.emptyFormText}>Formulario de Wompi en desarrollo</Text>
            <Text style={styles.emptyFormSubtext}>Próximamente podrás realizar pagos directamente con Wompi.</Text>
            {/* Espaciadores para igualar el tamaño */}
            <View style={styles.formSpacer}></View>
            <View style={styles.formSpacer}></View>
            <View style={styles.formSpacer}></View>
          </View>
        )
      case "nequi":
        return (
          <View style={styles.emptyFormContainer}>
            <Text style={styles.emptyFormText}>Formulario de Nequi en desarrollo</Text>
            <Text style={styles.emptyFormSubtext}>Próximamente podrás realizar pagos directamente con Nequi.</Text>
            {/* Espaciadores para igualar el tamaño */}
            <View style={styles.formSpacer}></View>
            <View style={styles.formSpacer}></View>
            <View style={styles.formSpacer}></View>
          </View>
        )
      default:
        return null
    }
  }

  // Renderizar la vista previa del método de pago
  const renderPaymentMethodPreview = ({
    item,
  }: {
    item: PaymentMethodType
    index: number
  }) => {
    switch (item) {
      case "card":
        return (
          <View style={styles.cardPreviewContainer}>
            <View style={styles.cardWrapper}>
              {/* Frente de la tarjeta */}
              <Animated.View style={[styles.cardPreview, styles.cardFace, frontAnimatedStyle]}>
                {/* Card Top Section */}
                <View style={styles.cardTopSection}>
                  <View style={styles.logoPlaceholder}>
                    {getCardLogo() && <Image source={getCardLogo()} style={styles.cardLogo} resizeMode="contain" />}
                  </View>
                  <Text style={expiryDate ? styles.cardExpiry : styles.cardExpiryPlaceholder}>
                    {expiryDate || "MM/YY"}
                  </Text>
                </View>

                <Text style={cardNumber ? styles.cardNumber : styles.cardNumberPlaceholder}>
                  {getDisplayCardNumber() || (cardType === "amex" ? "XXXX XXXXXX XXXXX" : "XXXX XXXX XXXX XXXX")}
                </Text>

                <Text style={cardHolder ? styles.cardHolder : styles.cardHolderPlaceholder}>
                  {cardHolder || "NOMBRE DEL TITULAR"}
                </Text>
              </Animated.View>

              {/* Reverso de la tarjeta */}
              <Animated.View style={[styles.cardPreview, styles.cardFace, styles.cardBack, backAnimatedStyle]}>
                <View style={styles.cardStripe} />
                <View style={styles.cardCvvContainer}>
                  <View style={styles.cardCvvLabel}>
                    <Text style={styles.cardCvvText}>CVV</Text>
                  </View>
                  <View style={styles.cardCvvValue}>
                    <Text style={styles.cardCvvValueText}>{cvv || ""}</Text>
                  </View>
                </View>
                <View style={styles.cardBackLogo}>
                  {getCardLogo() && <Image source={getCardLogo()} style={styles.cardLogoSmall} resizeMode="contain" />}
                </View>
              </Animated.View>
            </View>
          </View>
        )
      case "wompi":
        return (
          <View style={styles.paymentMethodPreviewContainer}>
            <View style={styles.wompiLogoContainer}>
              <Image
                source={require("src/assets/images/wompi_logo.png")}
                style={styles.paymentPreviewLogo}
                resizeMode="contain"
              />
            </View>
          </View>
        )
      case "nequi":
        return (
          <View style={styles.paymentMethodPreviewContainer}>
            <View style={styles.nequiLogoContainer}>
              <Image
                source={require("src/assets/images/nequi_logo_new.png")}
                style={styles.paymentPreviewLogo}
                resizeMode="contain"
              />
            </View>
          </View>
        )
      default:
        return null
    }
  }

  // Datos para el FlatList
  const paymentMethodsData: PaymentMethodType[] = ["card", "wompi", "nequi"]

  // Función para controlar el deslizamiento del carrusel
  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index
      handlePaymentMethodChange(index)
    }
  }).current

  // Configuración para determinar cuándo un elemento es visible
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("src/assets/images/Fondo8_FORTU.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Image
                  source={require("src/assets/images/back_button.png")}
                  style={styles.backButtonImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Método de pago</Text>
              <View style={{ width: 40 }} />
            </View>

            {/* Payment Method Preview Carousel */}
            <FlatList
              ref={flatListRef}
              data={paymentMethodsData}
              renderItem={renderPaymentMethodPreview}
              keyExtractor={(item, index) => `payment-method-${index}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.previewCarousel}
              snapToInterval={width}
              decelerationRate="fast"
              getItemLayout={(data, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
              onViewableItemsChanged={handleViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              initialScrollIndex={0}
              scrollEventThrottle={16}
              // Asegurar que solo se pueda deslizar un elemento a la vez
              onScroll={(event) => {
                const offsetX = event.nativeEvent.contentOffset.x
                const newIndex = Math.round(offsetX / width)
                if (newIndex !== activeIndex) {
                  setActiveIndex(newIndex)
                }
              }}
            />

            {/* Pagination Dots */}
            {renderPaginationDots()}

            {/* Form Container */}
            <View style={styles.formContainer}>
              {/* Render form based on active payment method */}
              {renderPaymentMethodForm()}

              {/* Add Payment Method Button - Solo visible para tarjetas */}
              {activePaymentMethod === "card" && (
                <TouchableOpacity
                  style={[styles.addButton, (isLoading || isCardSaved) && styles.addButtonDisabled]}
                  onPress={handleSave}
                  activeOpacity={0.7}
                  disabled={isLoading || isCardSaved}
                >
                  <Text style={styles.addButtonText}>
                    {isLoading ? "Guardando..." : isCardSaved ? "Tarjeta guardada" : "Agregar tarjeta"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Modal de error */}
        <ErrorPaymentModal visible={showErrorModal} onClose={() => setShowErrorModal(false)} message={errorMessage} />

        {/* Modal de éxito */}
        <SuccessPaymentModal visible={showSuccessModal} onClose={handleSuccessModalClose} />
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonImage: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
    textAlign: "center",
  },
  previewCarousel: {
    width: width,
  },
  paymentMethodPreviewContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    width: width,
    height: CARD_WIDTH / 1.6, // Mantener la misma altura que la tarjeta
  },
  cardPreviewContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    width: width,
  },
  wompiLogoContainer: {
    width: CARD_WIDTH,
    height: CARD_WIDTH / 1.6,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nequiLogoContainer: {
    width: CARD_WIDTH,
    height: CARD_WIDTH / 1.6,
    backgroundColor: "#FFFFFF", // Cambiado a blanco como solicitado
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  paymentLogoContainer: {
    width: CARD_WIDTH,
    height: CARD_WIDTH / 1.6,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  paymentPreviewLogo: {
    width: CARD_WIDTH * 0.7,
    height: CARD_WIDTH / 3,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_WIDTH / 1.6,
    position: "relative",
  },
  cardPreview: {
    width: "100%",
    height: "100%",
    backgroundColor: "#0A2F81", // Dark blue from the design
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardFace: {
    backfaceVisibility: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardBack: {
    padding: 0, // Sin padding para el reverso
  },
  cardStripe: {
    height: 50,
    backgroundColor: "#000",
    marginTop: 30,
  },
  cardCvvContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: 25,
  },
  cardCvvLabel: {
    width: 40,
    marginRight: 10,
  },
  cardCvvText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  cardCvvValue: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
  },
  cardCvvValueText: {
    fontSize: 16,
    textAlign: "right",
    letterSpacing: 2,
  },
  cardBackLogo: {
    position: "absolute",
    bottom: 25,
    right: 25,
  },
  cardLogoSmall: {
    width: 50,
    height: 30,
  },
  logoPlaceholder: {
    width: 60,
    height: 40,
    justifyContent: "center",
  },
  cardTopSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  cardLogo: {
    width: 60,
    height: 40,
  },
  cardExpiry: {
    color: colors.white,
    fontSize: 16,
  },
  cardExpiryPlaceholder: {
    color: "rgba(255, 255, 255, 0.3)",
    fontSize: 16,
  },
  cardNumber: {
    color: colors.white,
    fontSize: 20,
    letterSpacing: 1,
    marginBottom: 40,
  },
  cardNumberPlaceholder: {
    color: "rgba(255, 255, 255, 0.3)",
    fontSize: 20,
    letterSpacing: 1,
    marginBottom: 40,
  },
  cardHolder: {
    color: colors.white,
    fontSize: 16,
  },
  cardHolderPlaceholder: {
    color: "rgba(255, 255, 255, 0.3)",
    fontSize: 16,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  paginationDotTouchable: {
    padding: 10, // Área de toque más grande
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: colors.white,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 30,
    flex: 1,
    padding: 30,
    marginHorizontal: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  cardNumberInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  cardNumberInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: colors.text.primary,
  },
  inputCardLogo: {
    width: 40,
    height: 25,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: colors.text.primary,
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  halfInputSection: {
    width: "48%",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#59CDF2", // Light blue from the design
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonDisabled: {
    backgroundColor: "#A0D8F0", // Versión más clara para estado deshabilitado
    opacity: 0.8,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyFormContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyFormText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  emptyFormSubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  modalMessage: {
    fontSize: 16,
    color: colors.text.primary,
    textAlign: "center",
    lineHeight: 24,
  },
  formSpacer: {
    height: 50,
    marginBottom: 20,
  },
})

export default AddPaymentMethodScreen
