import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { formatCurrency } from '../../utils/helpers';

interface BalanceDisplayProps {
  balance: string | number;
  onPress?: () => void;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance, onPress }) => {
  return (
    <View style={styles.balanceContainer}>
      <View style={styles.balanceButton}>
        <Text style={styles.balanceText}>Saldo</Text>
      </View>
      <TouchableOpacity
        style={styles.balanceAmountContainer}
        onPress={onPress}
      >
        <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 30,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 5,
  },
  balanceButton: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  balanceText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  balanceAmountContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  dropdownIcon: {
    fontSize: 12,
    color: colors.text.secondary,
  },
});

export default BalanceDisplay;
