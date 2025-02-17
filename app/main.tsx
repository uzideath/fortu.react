import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the stack parameter list
type RootStackParamList = {
  Welcome: undefined;
  Register: undefined;
  Login: undefined;
};

// Define the navigation prop type
type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Welcome'
>;

type Props = {
  navigation: WelcomeScreenNavigationProp;
};

const { width } = Dimensions.get('window');

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const renderBackgroundPattern = () => {
    const patterns = [];
    for (let i = 0; i < 20; i++) {
      patterns.push(
        <Text
          key={i}
          style={[
            styles.patternText,
            {
              top: Math.random() * 600,
              left: Math.random() * width,
              transform: [{ rotate: `${Math.random() * 360}deg` }],
            },
          ]}
        >
          T
        </Text>
      );
    }
    return patterns;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.patternContainer}>{renderBackgroundPattern()}</View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>
            <Text style={styles.logoFor}>For</Text>
            <Text style={styles.logoTu}>tu</Text>
          </Text>
        </View>

        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Bienvenido(a)</Text>
          <Text style={styles.usernameText}>-Nombre de usuario-</Text>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.startButtonText}>Comenzar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4169E1',
  },
  patternContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  patternText: {
    position: 'absolute',
    fontSize: 40,
    color: 'rgba(135, 206, 250, 0.2)', // Light blue with opacity
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    fontSize: 48,
  },
  logoFor: {
    color: '#87CEFA',
  },
  logoTu: {
    color: '#FFD700',
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  usernameText: {
    fontSize: 20,
    color: 'white',
    opacity: 0.9,
  },
  startButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    borderRadius: 25,
    width: '100%',
  },
  startButtonText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default WelcomeScreen;
