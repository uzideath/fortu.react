'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Share } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { GamesStackParamList } from '../../types';
import { colors } from '../../styles/colors';
import BackButton from '../../components/common/BackButton';
import { api } from '../../services/api';
import type { Ticket } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';

type TicketDetailsScreenNavigationProp = StackNavigationProp<GamesStackParamList, 'TicketDetails'>
type TicketDetailsScreenRouteProp = RouteProp<GamesStackParamList, 'TicketDetails'>

interface TicketDetailsScreenProps {
  navigation: TicketDetailsScreenNavigationProp
  route: TicketDetailsScreenRouteProp
}

// Cambia la definición del componente para que acepte props opcionales
const TicketDetailsScreen: React.FC<Partial<TicketDetailsScreenProps>> = ({ navigation, route }) => {
  const ticketId = route?.params?.ticketId || '1';
  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const ticketData = await api.getTicketById(ticketId);
        if (ticketData) {
          setTicket(ticketData);
        }
      } catch (error) {
        console.error('Error fetching ticket:', error);
      }
    };

    fetchTicket();
  }, [ticketId]);

  const handleBack = (): void => {
    if (navigation) {
      navigation.goBack();
    }
  };

  const handleShare = async (): Promise<void> => {
    if (!ticket) {
      return;
    }

    try {
      await Share.share({
        message: `¡He apostado en ${ticket.lottery}! Mis números son: ${ticket.numbers.join(', ')}. ¡Deséame suerte!`,
        title: 'Mi apuesta en ForTu',
      });
    } catch (error) {
      console.error('Error sharing ticket:', error);
    }
  };

  const getStatusColor = (status: string): string => {
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

  if (!ticket) {
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
            <Text style={styles.headerTitle}>Detalles del ticket</Text>
            <View style={styles.spacer} />
          </View>
        </LinearGradient>

        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando detalles del ticket...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerTitle}>Detalles del ticket</Text>
          <View style={styles.spacer} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.ticketContainer}>
          <View style={styles.ticketHeader}>
            <View>
              <Text style={styles.ticketTitle}>{ticket.lottery}</Text>
              <Text style={styles.ticketDate}>{formatDate(ticket.date)}</Text>
            </View>

            <View style={[styles.statusContainer, { backgroundColor: getStatusColor(ticket.status) }]}>
              <Text style={styles.statusText}>{ticket.status}</Text>
            </View>
          </View>

          <View style={styles.ticketSection}>
            <Text style={styles.sectionTitle}>Números seleccionados</Text>
            <View style={styles.numbersContainer}>
              {ticket.numbers.map((number, index) => (
                <View key={index} style={styles.numberCircle}>
                  <Text style={styles.numberText}>{number}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.ticketSection}>
            <Text style={styles.sectionTitle}>Detalles de la apuesta</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>ID del ticket:</Text>
              <Text style={styles.detailValue}>#{ticket.id}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fecha de compra:</Text>
              <Text style={styles.detailValue}>{formatDate(ticket.date)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Monto apostado:</Text>
              <Text style={styles.detailValue}>{formatCurrency(ticket.amount)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Estado:</Text>
              <Text style={[styles.detailValue, { color: getStatusColor(ticket.status) }]}>{ticket.status}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareButtonText}>Compartir ticket</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  ticketContainer: {
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
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  ticketTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 5,
  },
  ticketDate: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  statusContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  statusText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  ticketSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 15,
  },
  numbersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  shareButton: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  shareButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  spacer: {
    width: 40,
  },
});

export default TicketDetailsScreen;
