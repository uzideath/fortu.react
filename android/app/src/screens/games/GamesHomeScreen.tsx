import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { GamesStackParamList } from '../../types';
import { colors } from '../../styles/colors';
import BackButton from '../../components/common/BackButton';
import BalanceDisplay from '../../components/common/BalanceDisplay';
import LotteryCard from '../../components/common/LotteryCard';
import GroupCard from '../../components/common/GroupCard';
import { api } from '../../services/api';
import { Lottery, Group } from '../../types';

type GamesHomeScreenNavigationProp = StackNavigationProp<GamesStackParamList, 'GamesHome'>;

interface GamesHomeScreenProps {
  navigation: GamesHomeScreenNavigationProp;
}

const GamesHomeScreen: React.FC<GamesHomeScreenProps> = ({ navigation }) => {
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lotteriesData = await api.getLotteries();
        const groupsData = await api.getGroups();

        setLotteries(lotteriesData);
        setGroups(groupsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleBack = (): void => {
    navigation.goBack();
  };

  const handleLotteryPress = (lottery: Lottery): void => {
    navigation.navigate('GroupDetail', { lotteryId: lottery.id });
  };

  const handleGroupPress = (_group: Group): void => {
    navigation.navigate('GroupDetail', { lotteryId: 'baloto' });
  };

  const handleViewAllLotteries = (): void => {
    navigation.navigate('LotteriesList');
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
          <Text style={styles.headerTitle}>Juegos</Text>
          <View style={styles.spacer} />
        </View>

        <BalanceDisplay balance="108750" />
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Loterías populares</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={handleViewAllLotteries}
            >
              <Text style={styles.viewAllText}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          {lotteries.map((lottery) => (
            <LotteryCard
              key={lottery.id}
              lottery={lottery}
              onPress={handleLotteryPress}
            />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Grupos recomendados</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onPress={handleGroupPress}
            />
          ))}
        </View>
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
    marginBottom: 20,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  viewAllButton: {
    // No background needed
  },

  viewAllText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  spacer: {
    width: 40,
  },
});

export default GamesHomeScreen;
