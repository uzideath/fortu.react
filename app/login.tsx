import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Image,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';

const LoginScreen = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showError, setShowError] = useState(false);

  const handleLogin = async () => {
    try {
      // Simulate API call
      const response = await fetch('https://api.example.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setShowError(true);
      }
    } catch (error) {
      setShowError(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <Text style={styles.logo}>
        <Text style={styles.logoFor}>For</Text>
        <Text style={styles.logoTu}>tu</Text>
      </Text>

      {/* Login Form */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Iniciar sesión</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Usuario"
            value={formData.username}
            onChangeText={(text) => setFormData({ ...formData, username: text })}
            placeholderTextColor="#A0A0A0"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
            placeholderTextColor="#A0A0A0"
          />
        </View>

        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.forgotPassword}>¿Olvidó su clave?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Ingresar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={{ uri: 'https://www.google.com/favicon.ico' }}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Continuar con google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={{ uri: 'https://www.apple.com/favicon.ico' }}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Continuar AppleID</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.createAccountButton}>
          <Text style={styles.createAccountText}>Crear una cuenta</Text>
        </TouchableOpacity>
      </View>

      {/* Error Modal */}
      <Modal
        visible={showError}
        transparent
        animationType="fade"
        onRequestClose={() => setShowError(false)}
      >
        <View style={styles.modalContainer}>
          <BlurView
            style={styles.blur}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
          />
          <View style={styles.modalContent}>
            <View style={styles.errorIcon}>
              <Text style={styles.errorX}>×</Text>
            </View>
            <Text style={styles.errorTitle}>¡Ups! sa no es tu clave</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowError(false)}
              >
                <Text style={styles.modalButtonText}>Volver a intentar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonOutline]}
                onPress={() => {}}
              >
                <Text style={styles.modalButtonTextOutline}>Olvidé mi clave</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4169E1',
    padding: 20,
  },
  logo: {
    fontSize: 48,
    marginBottom: 40,
    textAlign: 'center',
  },
  logoFor: {
    color: '#87CEFA',
  },
  logoTu: {
    color: '#FFD700',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 24,
    color: '#4169E1',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#F5F6FA',
    borderRadius: 25,
    padding: 15,
    fontSize: 16,
  },
  forgotPassword: {
    color: '#4169E1',
    textAlign: 'right',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#4169E1',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 16,
    color: '#333',
  },
  createAccountButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  createAccountText: {
    color: '#4169E1',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: '#4169E1',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  errorIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#87CEFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  errorX: {
    fontSize: 40,
    color: '#4169E1',
    fontWeight: 'bold',
  },
  errorTitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    width: '100%',
    gap: 10,
  },
  modalButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'white',
  },
  modalButtonText: {
    color: '#4169E1',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonTextOutline: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;