import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { Group } from '../../types';

interface GroupCardProps {
  group: Group;
  onPress: (group: Group) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(group)}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{group.name}</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>{group.score}/100</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Miembros</Text>
          <Text style={styles.detailValue}>{group.members}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Juego</Text>
          <Text style={styles.detailValue}>{group.game}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Tickets</Text>
          <Text style={[styles.detailValue, styles.ticketsValue]}>{group.tickets}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  scoreContainer: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  score: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  ticketsValue: {
    color: colors.secondary,
  },
});

export default GroupCard;
