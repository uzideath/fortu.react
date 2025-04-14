import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { GamesStackParamList } from '../../types';
import { colors } from '../../styles/colors';

type BetSuccessScreenNavigationProp = StackNavigationProp<GamesStackParamList, 'BetSuccess'>;

interface BetSuccessScreenProps {
  navigation: BetSuccessScreenNavigationProp;
}

const BetSuccessScreen: React.FC<BetSuccessScreenProps> = ({ navigation }) => {
  const handleViewTicket = (): void => {
    navigation.navigate('TicketDetails', { ticketId: 'someTicketId' });
  };

  const handleGoHome = (): void => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'GamesHome' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.successIconContainer}>
            <Text style={styles.successIcon}>✓</Text>
          </View>

          <Text style={styles.title}>¡Apuesta realizada!</Text>

          <Text style={styles.message}>
            Tu apuesta ha sido registrada exitosamente. Puedes ver los detalles
            de tu ticket en cualquier momento.
          </Text>

          <View style={styles.ticketContainer}>
            <View style={styles.ticketHeader}>
              <Text style={styles.ticketTitle}>Baloto</Text>
              <Text style={styles.ticketDate}>15/04/2023</Text>
            </View>

            <View style={styles.numbersContainer}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>1</Text>
              </View>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>5</Text>
              </View>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>7</Text>
              </View>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>9</Text>
              </View>
            </View>

            <View style={styles.ticketFooter}>
              <Text style={styles.ticketAmount}>Monto: $21.400</Text>
              <Text style={styles.ticketStatus}>Pendiente</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.viewTicketButton}
            onPress={handleViewTicket}
          >
            <Text style={styles.viewTicketButtonText}>Ver detalles del ticket</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={handleGoHome}
          >
            <Text style={styles.homeButtonText}>Volver al inicio</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },

  successIcon: {
    fontSize: 60,
    color: colors.white,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 20,
    textAlign: 'center',
  },

  message: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },

  ticketContainer: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    width: '100%',
    marginBottom: 30,
    ...{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
  },

  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  ticketTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },

  ticketDate: {
    fontSize: 14,
    color: colors.text.secondary,
  },

  numbersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
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

  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  ticketAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },

  ticketStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.status.warning,
  },

  viewTicketButton: {
    backgroundColor: colors.secondary,
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },

  viewTicketButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },

  homeButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    width: '100%',
  },

  homeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BetSuccessScreen;
