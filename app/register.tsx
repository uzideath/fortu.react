import { useRouter } from 'expo-router'; // ✅ Import useRouter
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';

const RegisterScreen = () => {
  const router = useRouter(); // ✅ Use router for navigation

  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    identificacion: '',
    fechaNacimiento: '',
    email: '',
    celular: '',
    password: '',
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>T</Text>
          <View style={styles.logoAccent} />
        </View>

        {/* Header */}
        <Text style={styles.title}>¡Hola!</Text>
        <Text style={styles.subtitle}>Crear una cuenta nueva</Text>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Nombres</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setFormData({ ...formData, nombres: text })}
                value={formData.nombres}
                placeholder=""
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Apellidos</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setFormData({ ...formData, apellidos: text })}
                value={formData.apellidos}
                placeholder=""
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}># de Identificación</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setFormData({ ...formData, identificacion: text })}
                value={formData.identificacion}
                keyboardType="numeric"
                placeholder=""
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Fecha de nacimiento</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setFormData({ ...formData, fechaNacimiento: text })}
                value={formData.fechaNacimiento}
                placeholder="DD/MM/AAAA"
              />
            </View>
          </View>

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            value={formData.email}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder=""
          />

          <Text style={styles.label}>Celular</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setFormData({ ...formData, celular: text })}
            value={formData.celular}
            keyboardType="phone-pad"
            placeholder=""
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            value={formData.password}
            secureTextEntry
            placeholder=""
          />
          <Text style={styles.passwordHint}>Usa mínimo 8 carácteres</Text>

          {/* Social Login Buttons */}
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={{ uri: 'https://www.google.com/favicon.ico' }}
              style={styles.socialIcon}
            />
            <Text style={styles.socialButtonText}>Continuar con Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={{ uri: 'https://www.apple.com/favicon.ico' }}
              style={styles.socialIcon}
            />
            <Text style={styles.socialButtonText}>Continuar con Apple ID</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes una cuenta en Fortu?</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}>Inicia Sesión</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4169E1',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#87CEFA',
  },
  logoAccent: {
    width: 10,
    height: 10,
    backgroundColor: '#FFD700',
    marginLeft: 2,
    borderRadius: 2,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: 'white',
    marginBottom: 30,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  halfInput: {
    width: '48%',
  },
  label: {
    fontSize: 16,
    color: '#4169E1',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#E6E9F9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  passwordHint: {
    color: '#666',
    fontSize: 14,
    marginBottom: 20,
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
  loginContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
    fontSize: 16,
    marginBottom: 5,
  },
  loginLink: {
    color: '#4169E1',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
