import type React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';

interface BackButtonProps {
  onPress: () => void
  light?: boolean
}

const BackButton: React.FC<BackButtonProps> = ({ onPress, light = true }) => {
  return (
    <TouchableOpacity style={[styles.backButton, light ? styles.lightButton : styles.darkButton]} onPress={onPress}>
      <Text style={styles.backButtonIcon}>⬅️</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightButton: {
    backgroundColor: `${colors.white}33`, // 20% de opacidad
  },
  darkButton: {
    backgroundColor: `${colors.black}1A`, // 10% de opacidad
  },
  backButtonIcon: {
    fontSize: 20,
  },
});

export default BackButton;
