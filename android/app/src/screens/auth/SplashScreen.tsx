import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
  ImageBackground,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { colors } from '../../styles/colors';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

interface SplashScreenProps {
  navigation: SplashScreenNavigationProp;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    // Simulación de carga inicial
    const timer = setTimeout(() => {
      // Navegar a la pantalla de login después de 2 segundos
      navigation.replace('Login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/Fondo1_FORTU.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <Image source={require('../../assets/images/Logo_FORTU.png')} style={styles.logo} resizeMode="contain" />
          <ActivityIndicator size="large" color={colors.white} style={styles.loader} />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 80,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: colors.white,
    marginBottom: 50,
  },
  loader: {
    marginTop: 20,
  },
});

export default SplashScreen;
