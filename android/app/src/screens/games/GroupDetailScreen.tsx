import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { GamesStackParamList } from '../../types';
import { colors } from '../../styles/colors';
import BackButton from '../../components/common/BackButton';
import { Group } from '../../types';

type GroupDrawScreenNavigationProp = StackNavigationProp<GamesStackParamList, 'GroupDraw'>;

interface GroupDrawScreenProps {
  navigation: GroupDrawScreenNavigationProp;
}

const GroupDrawScreen: React.FC<GroupDrawScreenProps> = ({ navigation }) => {
  const [groups, _setGroups] = useState<Group[]>([
    { id: '1', name: 'Grupo 33', members: 120, game: 'Baloto', tickets: 829, score: 98 },
    { id: '2', name: 'Grupo 15', members: 85, game: 'Chance', tickets: 456, score: 85 },
    { id: '3', name: 'Grupo 27', members: 210, game: 'Lotería de Bogotá', tickets: 1024, score: 92 },
    { id: '4', name: 'Grupo 42', members: 65, game: 'Super Astro', tickets: 312, score: 78 },
    { id: '5', name: 'Grupo 19', members: 150, game: 'Baloto', tickets: 720, score: 88 },
  ]);

  const handleBack = (): void => {
    navigation.goBack();
  };

  const handleGroupPress = (_group: Group): void => {
    navigation.navigate('GroupDetail', { lotteryId: 'baloto' });
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
          <Text style={styles.headerTitle}>Grupos disponibles</Text>
          <View style={styles.spacer} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Selecciona un grupo</Text>

        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.groupItem}
              onPress={() => handleGroupPress(item)}
            >
              <View style={styles.groupHeader}>
                <Text style={styles.groupName}>{item.name}</Text>
                <View style={styles.scoreContainer}>
                  <Text style={styles.score}>{item.score}/100</Text>
                </View>
              </View>

              <View style={styles.groupDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Miembros</Text>
                  <Text style={styles.detailValue}>{item.members}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Juego</Text>
                  <Text style={styles.detailValue}>{item.game}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Tickets</Text>
                  <Text style={[styles.detailValue, styles.ticketsValue]}>
                    {item.tickets}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity
          style={styles.createGroupButton}
          onPress={() => {}}
        >
          <Text style={styles.createGroupButtonText}>+ Crear nuevo grupo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  spacer: {
    width: 40,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 20,
  },
  groupItem: {
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
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  groupName: {
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
  groupDetails: {
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
  createGroupButton: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  createGroupButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GroupDrawScreen;
