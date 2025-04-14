'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ImageBackground, StatusBar } from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types';
import { colors } from '../../styles/colors';
import { authService } from '../../services/auth';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>

interface WelcomeScreenProps {
  navigation: WelcomeScreenNavigationProp
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const [userName, setUserName] = useState<string>('Nombre de usuario');

  useEffect(() => {
    // Intentar obtener el nombre del usuario actual
    const fetchUserData = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user && user.name) {
          // Extraer solo el primer nombre
          const firstName = user.name.split(' ')[0];
          setUserName(firstName);
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleContinue = (): void => {
    navigation.navigate('MainApp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <ImageBackground
        source={require('../../assets/images/Fondo3_FORTU.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <View style={styles.bottomContainer}>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeTitle}>Bienvenido(a)</Text>
              <Text style={styles.userName}>-{userName}-</Text>
            </View>

            <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
              <Text style={styles.continueButtonText}>Comenzar</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  bottomContainer: {
    marginBottom: 50,
  },
  welcomeContainer: {
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  userName: {
    fontSize: 24,
    color: colors.white,
    opacity: 0.9,
  },
  continueButton: {
    backgroundColor: colors.accent,
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    width: '100%',
  },
  continueButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
