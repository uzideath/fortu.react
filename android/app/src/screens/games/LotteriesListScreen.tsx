import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { GamesStackParamList } from '../../types';
import { colors } from '../../styles/colors';
import BackButton from '../../components/common/BackButton';
import LotteryCard from '../../components/common/LotteryCard';
import { api } from '../../services/api';
import { Lottery } from '../../types';

type LotteriesListScreenNavigationProp = StackNavigationProp<GamesStackParamList, 'LotteriesList'>;

interface LotteriesListScreenProps {
  navigation: LotteriesListScreenNavigationProp;
}

const LotteriesListScreen: React.FC<LotteriesListScreenProps> = ({ navigation }) => {
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredLotteries, setFilteredLotteries] = useState<Lottery[]>([]);

  useEffect(() => {
    const fetchLotteries = async () => {
      try {
        const lotteriesData = await api.getLotteries();
        setLotteries(lotteriesData);
        setFilteredLotteries(lotteriesData);
      } catch (error) {
        console.error('Error fetching lotteries:', error);
      }
    };

    fetchLotteries();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredLotteries(lotteries);
    } else {
      const filtered = lotteries.filter(lottery =>
        lottery.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLotteries(filtered);
    }
  }, [searchQuery, lotteries]);

  const handleBack = (): void => {
    navigation.goBack();
  };

  const handleLotteryPress = (lottery: Lottery): void => {
    navigation.navigate('GroupDetail', { lotteryId: lottery.id });
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
          <Text style={styles.headerTitle}>Loterías</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar lotería..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <FlatList
          data={filteredLotteries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <LotteryCard
              lottery={item}
              onPress={handleLotteryPress}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No se encontraron loterías que coincidan con tu búsqueda.
              </Text>
            </View>
          }
        />
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
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 15,
    color: colors.white,
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default LotteriesListScreen;
