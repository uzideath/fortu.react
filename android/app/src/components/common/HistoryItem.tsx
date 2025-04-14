import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { GameHistory } from '../../types';
import { formatCurrency } from '../../utils/helpers';

interface HistoryItemProps {
  item: GameHistory;
  onPress: (item: GameHistory) => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item, onPress }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ganador':
        return colors.status.success;
      case 'Pendiente':
        return colors.status.warning;
      case 'Perdedor':
        return colors.status.error;
      default:
        return colors.text.secondary;
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item)}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🎮</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>

      <View style={styles.rightContent}>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
        <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    ...{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default HistoryItem;
