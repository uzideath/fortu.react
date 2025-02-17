import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const UserDashboard = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.balanceLabel}>Saldo</Text>
              <Text style={styles.balanceAmount}>$ 87.600</Text>
            </View>
            <View style={styles.userSection}>
              <Text style={styles.userName}>Nombre{'\n'}de usuario</Text>
              <Image
                source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-17%20at%205.26.39%E2%80%AFPM-xcCfkikW1knpwzXyTueHCQ7ImrmjGv.png' }}
                style={styles.userAvatar}
              />
            </View>
          </View>
          <View style={styles.headerCurve} />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="view-grid" size={24} color="white" />
            <Text style={styles.actionText}>Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="wallet-plus" size={24} color="white" />
            <Text style={styles.actionText}>Cargar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="wallet-outline" size={24} color="white" />
            <Text style={styles.actionText}>Retirar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="ticket-outline" size={24} color="white" />
            <Text style={styles.actionText}>Tiquetes</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentSection}>
          <View style={styles.paymentHeader}>
            <Text style={styles.sectionTitle}>Medios de pago</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Agregar</Text>
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={['#000066', '#000033']}
            style={styles.cardContainer}
          >
            <Text style={styles.visaText}>VISA</Text>
            <Text style={styles.cardNumber}>**** ***** 6032</Text>
          </LinearGradient>
        </View>

        {/* News Section */}
        <View style={styles.newsSection}>
          <Text style={styles.sectionTitle}>Novedades</Text>
          
          <View style={styles.newsCard}>
            <View style={styles.newsIconContainer}>
              <MaterialCommunityIcons 
                name="cellphone-check" 
                size={30} 
                color="#4169E1" 
              />
            </View>
            <Text style={styles.newsText}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
            </Text>
          </View>

          <View style={styles.newsCard}>
            <View style={styles.newsIconContainer}>
              <Feather name="user" size={30} color="#4169E1" />
            </View>
            <Text style={styles.newsText}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4169E1',
  },
  header: {
    height: 200,
    position: 'relative',
  },
  headerContent: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerCurve: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: '#87CEFA',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  balanceLabel: {
    color: 'white',
    fontSize: 16,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userSection: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 10,
  },
  userName: {
    color: 'white',
    textAlign: 'right',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#87CEFA',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
  paymentSection: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#87CEFA',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cardContainer: {
    height: 200,
    borderRadius: 15,
    padding: 20,
    justifyContent: 'space-between',
  },
  visaText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
  },
  cardNumber: {
    color: 'white',
    fontSize: 18,
  },
  newsSection: {
    backgroundColor: 'white',
    padding: 20,
  },
  newsCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  newsIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#F5F6FA',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  newsText: {
    flex: 1,
    color: '#666',
    fontSize: 14,
  },
});

export default UserDashboard;