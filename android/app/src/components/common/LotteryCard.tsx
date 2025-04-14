import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { Lottery } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';

interface LotteryCardProps {
  lottery: Lottery;
  onPress: (lottery: Lottery) => void;
}

const LotteryCard: React.FC<LotteryCardProps> = ({ lottery, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(lottery)}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{lottery.icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{lottery.name}</Text>
        <Text style={styles.nextDraw}>
          Próximo sorteo: {formatDate(lottery.nextDraw)}
        </Text>
        <Text style={styles.prize}>
          Premio: {formatCurrency(lottery.prize)}
        </Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={styles.score}>{lottery.score}/100</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    ...{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    fontSize: 24,
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
  nextDraw: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 3,
  },
  prize: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  scoreContainer: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  score: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default LotteryCard;
