import React, { useState, useEffect } from 'react';
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
import { MainStackParamList } from '../../types';
import { colors } from '../../styles/colors';
import BackButton from '../../components/common/BackButton';
import { PaymentMethod } from '../../types';
import { api } from '../../services/api';

type PaymentSectionScreenNavigationProp = StackNavigationProp<MainStackParamList, 'PaymentSection'>;

interface PaymentSectionScreenProps {
  navigation: PaymentSectionScreenNavigationProp;
}

const PaymentSectionScreen: React.FC<PaymentSectionScreenProps> = ({ navigation }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const methods = await api.getPaymentMethods();
        setPaymentMethods(methods);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      }
    };

    fetchPaymentMethods();
  }, []);

  const handleBack = (): void => {
    navigation.goBack();
  };

  const handleAddPaymentMethod = (): void => {
    navigation.navigate('AddPaymentMethod');
  };

  const handlePaymentMethodPress = (method: PaymentMethod): void => {
    // En una aplicación real, aquí se podría mostrar detalles o editar
    console.log('Selected payment method:', method);
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
          <Text style={styles.headerTitle}>Métodos de pago</Text>
          <View style={styles.spacer} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Mis métodos de pago</Text>

        <FlatList
          data={paymentMethods}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.paymentMethodItem,
                item.isDefault && styles.defaultPaymentMethod,
              ]}
              onPress={() => handlePaymentMethodPress(item)}
            >
              <View style={styles.paymentMethodIcon}>
                <Text style={styles.paymentMethodIconText}>{item.icon}</Text>
              </View>

              <View style={styles.paymentMethodInfo}>
                <Text style={styles.paymentMethodName}>{item.name}</Text>
                {item.isDefault && (
                  <Text style={styles.defaultLabel}>Predeterminado</Text>
                )}
              </View>

              <Text style={styles.paymentMethodArrow}>›</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No tienes métodos de pago registrados.
              </Text>
            </View>
          }
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddPaymentMethod}
        >
          <Text style={styles.addButtonText}>+ Agregar método de pago</Text>
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
    fontSize: 18,
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
  paymentMethodItem: {
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
  defaultPaymentMethod: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  paymentMethodIconText: {
    fontSize: 20,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 5,
  },
  defaultLabel: {
    fontSize: 12,
    color: colors.primary,
  },
  paymentMethodArrow: {
    fontSize: 20,
    color: colors.text.secondary,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentSectionScreen;
