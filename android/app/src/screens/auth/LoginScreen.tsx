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

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleLogin = (): void => {
    // Para pruebas, permitir cualquier entrada
    if (email.trim() === '' && password.trim() === '') {
      // Si ambos están vacíos, navegar directamente
      navigation.navigate('MainApp');
      return;
    }

    // Validación básica
    if (!isValidEmail(email)) {
      setErrorMessage('Por favor, ingresa un correo electrónico válido.');
      setShowErrorModal(true);
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Por favor, ingresa tu contraseña.');
      setShowErrorModal(true);
      return;
    }

    // Navegar a la pantalla principal
    navigation.navigate('MainApp');
  };

  const handleRegister = (): void => {
    navigation.navigate('Register');
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
        source={require('../../assets/images/Fondo2_FORTU.png')}
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
              <Image source={require('../../assets/images/Logo_FORTU.png')} style={styles.logo} resizeMode="contain" />
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.loginText}>Iniciar sesión</Text>

              <View style={styles.inputContainer}>
                <View style={styles.iconContainer}>
                  <Text style={styles.inputIcon}>👤</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Usuario"
                  placeholderTextColor="#B0C8EA"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textAlign="center"
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.iconContainer}>
                  <Text style={styles.inputIcon}>🔒</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  placeholderTextColor="#B0C8EA"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  textAlign="center"
                />
              </View>

              <TouchableOpacity style={styles.forgotPasswordButton}>
                <Text style={styles.forgotPasswordText}>¿Olvidó su clave?</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.7}>
                <Text style={styles.loginButtonText}>Ingresar</Text>
              </TouchableOpacity>

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

              <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerButtonText}>Crear una cuenta</Text>
              </TouchableOpacity>
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
    justifyContent: 'flex-end',
    paddingTop: 0,
    paddingBottom: 0,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'absolute',
    top: '30%', // Bajado de 25% a 30%
    alignSelf: 'center',
    zIndex: 1,
  },
  logo: {
    width: 180,
    height: 70,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
    marginTop: 80,
    marginBottom: 0,
  },
  loginText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 30,
    marginBottom: 10, // Reducido de 15 a 10 para juntar más los inputs
    paddingHorizontal: 15,
    height: 45,
  },
  iconContainer: {
    marginRight: 10,
    width: 20,
  },
  inputIcon: {
    fontSize: 18,
    color: '#B0C8EA',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: colors.text.primary,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    padding: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 30,
    padding: 10,
    marginBottom: 8, // Reducido de 15 a 8 para juntar más los botones sociales
    height: 42,
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
  registerButton: {
    alignSelf: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
