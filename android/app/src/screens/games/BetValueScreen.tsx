'use client';

import type React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { GamesStackParamList } from '../../types';
import { colors } from '../../styles/colors';
import BackButton from '../../components/common/BackButton';
import { formatCurrency } from '../../utils/helpers';

type BetValueScreenNavigationProp = StackNavigationProp<GamesStackParamList, 'BetValue'>

interface BetValueScreenProps {
  navigation: BetValueScreenNavigationProp
}

const BetValueScreen: React.FC<BetValueScreenProps> = ({ navigation }) => {
  const [betAmount, setBetAmount] = useState<string>('10000');
  const [selectedNumbers, _setSelectedNumbers] = useState<string[]>(['1', '5', '7', '9']);

  const handleBack = (): void => {
    navigation.goBack();
  };

  const handleAmountChange = (amount: string): void => {
    // Eliminar caracteres no numéricos
    const numericValue = amount.replace(/[^0-9]/g, '');
    setBetAmount(numericValue);
  };

  const handleQuickAmount = (amount: string): void => {
    setBetAmount(amount);
  };

  const handleContinue = (): void => {
    // Validar que el monto sea mayor a cero
    if (Number.parseInt(betAmount, 10) <= 0) {
      // Aquí podríamos mostrar un error
      return;
    }

    // Navegar a la pantalla de éxito
    navigation.navigate('BetSuccess');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <BackButton onPress={handleBack} />
          <Text style={styles.headerTitle}>Valor de la apuesta</Text>
          <View style={styles.spacer} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Números seleccionados</Text>

          <View style={styles.numbersContainer}>
            {selectedNumbers.map((number, index) => (
              <View key={index} style={styles.numberCircle}>
                <Text style={styles.numberText}>{number}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monto de la apuesta</Text>

          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={betAmount}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.text.secondary}
            />
          </View>

          <Text style={styles.amountHint}>Ingresa el monto que deseas apostar</Text>

          <View style={styles.quickAmountsContainer}>
            <TouchableOpacity style={styles.quickAmountButton} onPress={() => handleQuickAmount('5000')}>
              <Text style={styles.quickAmountText}>$5.000</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAmountButton} onPress={() => handleQuickAmount('10000')}>
              <Text style={styles.quickAmountText}>$10.000</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAmountButton} onPress={() => handleQuickAmount('20000')}>
              <Text style={styles.quickAmountText}>$20.000</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAmountButton} onPress={() => handleQuickAmount('50000')}>
              <Text style={styles.quickAmountText}>$50.000</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen</Text>

          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Lotería:</Text>
              <Text style={styles.summaryValue}>Baloto</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Números:</Text>
              <Text style={styles.summaryValue}>{selectedNumbers.join(', ')}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Monto:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(betAmount)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Posible premio:</Text>
              <Text style={[styles.summaryValue, styles.prizeValue]}>
                {formatCurrency(Number.parseInt(betAmount, 10) * 100)}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Confirmar apuesta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 15,
  },
  numbersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    ...{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
  },
  numberCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    ...{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  amountHint: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 15,
    textAlign: 'center',
  },
  quickAmountsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    width: '48%',
    alignItems: 'center',
    marginBottom: 10,
    ...{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
  },
  quickAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  summaryContainer: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    ...{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  prizeValue: {
    color: colors.status.success,
  },
  continueButton: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  continueButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  spacer: {
    width: 40,
  },
});

export default BetValueScreen;
