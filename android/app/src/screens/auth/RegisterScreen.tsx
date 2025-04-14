'use client';

import type React from 'react';
import { useState } from 'react';
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
} from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types';
import ErrorModal from '../../components/modals/ErrorModal';
import { colors } from '../../styles/colors';
import { isValidEmail } from '../../utils/helpers';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [idNumber, setIdNumber] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleRegister = (): void => {
    // Validación básica
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Por favor, ingresa tu nombre completo.');
      setShowErrorModal(true);
      return;
    }

    if (!idNumber.trim()) {
      setErrorMessage('Por favor, ingresa tu número de identificación.');
      setShowErrorModal(true);
      return;
    }

    if (!birthDate.trim()) {
      setErrorMessage('Por favor, ingresa tu fecha de nacimiento.');
      setShowErrorModal(true);
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Por favor, ingresa un correo electrónico válido.');
      setShowErrorModal(true);
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('Por favor, ingresa tu número de celular.');
      setShowErrorModal(true);
      return;
    }

    if (password.length < 8) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres.');
      setShowErrorModal(true);
      return;
    }

    // Navegar a la pantalla de bienvenida
    navigation.navigate('Welcome');
  };

  const handleLogin = (): void => {
    navigation.navigate('Login');
  };

  const handleGoogleLogin = (): void => {
    // Implementación futura de login con Google
    console.log('Login con Google');
  };

  const handleAppleLogin = (): void => {
    // Implementación futura de login con Apple
    console.log('Login con Apple');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/Fondo5_FORTU.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/Logo_Simbolo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
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
                    onChangeText={setBirthDate}
                    keyboardType="number-pad"
                  />
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
                <TextInput
                  style={styles.input}
                  placeholder=""
                  placeholderTextColor="#B0C8EA"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <View style={styles.passwordRequirementContainer}>
                <View style={styles.checkCircle} />
                <Text style={styles.passwordRequirementText}>Usa mínimo 8 carácteres</Text>
              </View>

              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
                  <Image
                    source={require('../../assets/images/google_logo.jpg')}
                    style={styles.socialLogo}
                    resizeMode="contain"
                  />
                  <Text style={styles.socialButtonText}>Continuar con google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton} onPress={handleAppleLogin}>
                  <Image
                    source={require('../../assets/images/apple_logo.png')}
                    style={styles.socialLogo}
                    resizeMode="contain"
                  />
                  <Text style={styles.socialButtonText}>Continuar AppleID</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.continueButton} onPress={handleRegister} activeOpacity={0.7}>
                <View style={styles.arrowContainer}>
                  <View style={styles.arrowLine} />
                  <View style={styles.arrowHead} />
                </View>
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

        <ErrorModal visible={showErrorModal} onClose={() => setShowErrorModal(false)} message={errorMessage} />
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingTop: 40,
  },
  logoContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    zIndex: 1,
  },
  logo: {
    width: 60,
    height: 60,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 160,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 24,
    color: colors.white,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    paddingTop: 40,
    paddingBottom: 40,
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  halfInputContainer: {
    width: '48%',
  },
  fullInputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#D1DFFA',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: colors.text.primary,
  },
  passwordRequirementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 10,
  },
  passwordRequirementText: {
    fontSize: 14,
    color: colors.primary,
  },
  socialButtonsContainer: {
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
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
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  arrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowLine: {
    width: 16,
    height: 3,
    backgroundColor: colors.white,
    marginRight: -1,
  },
  arrowHead: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 0,
    borderRightWidth: 10,
    borderBottomWidth: 7,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: colors.white,
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    transform: [{ rotate: '180deg' }],
  },
  loginContainer: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 5,
  },
  loginButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
