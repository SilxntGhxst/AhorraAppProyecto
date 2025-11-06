import React from 'react';
import { SafeAreaView, ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import {Ionicons,MaterialIcons} from '@expo/vector-icons';

export default function AhorraAppScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
     <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={styles.iconContent}>     
          <Image
            source={require('../assets/Puerquito2.jpg')}
            style={styles.icono}
          />
          <Text style={styles.logoText}>Ahorra +App</Text>
        </View>
        
        <View style={styles.profileIcon}>
          <Ionicons name="person-circle-outline" size={32} color="#0D7A43" />
        </View>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardTitle}>Ingresos del mes</Text>
            <Text style={styles.trendUp}>↗</Text>
          </View>
          <Text style={styles.amount}>$0.00</Text>
          <Text style={styles.small}>+20.1% desde el mes pasado</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardTitle}>Gastos del mes</Text>
            <Text style={styles.trendDown}>↘</Text>
          </View>
          <Text style={styles.amount}>$0.00</Text>
          <Text style={styles.small}>+12.5% desde el mes pasado</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardTitle}>Balance</Text>
            <Text style={styles.balanceSign}>$</Text>
          </View>
          <Text style={styles.amount}>$0.00</Text>
          <Text style={styles.small}>Superávit mensual</Text>
        </View>

        <View style={[styles.card, styles.budgetCard]}>
          <Text style={styles.cardTitle}>Presupuestos del mes</Text>
          <Text style={styles.small}>Progreso de tus presupuestos del mes</Text>

          <View style={styles.budgetRow}>
            <View style={styles.bullet} />
            <View style={styles.budgetInfo}>
              <Text style={styles.budgetLabel}>Alimentacion</Text>
              <Text style={styles.budgetNumbers}>$0.00 / $3,000.00</Text>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: '0%' }]} />
              </View>
            </View>
          </View>

          <View style={styles.budgetRow}>
            <View style={[styles.bullet, { backgroundColor: '#F59E0B' }]} />
            <View style={styles.budgetInfo}>
              <Text style={styles.budgetLabel}>Transporte</Text>
              <Text style={styles.budgetNumbers}>$0.00 / $1,500.00</Text>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: '0%' }]} />
              </View>
            </View>
          </View>

          <View style={styles.budgetRow}>
            <View style={[styles.bullet, { backgroundColor: '#34D399' }]} />
            <View style={styles.budgetInfo}>
              <Text style={styles.budgetLabel}>Entretenimiento</Text>
              <Text style={styles.budgetNumbers}>$0.00 / $2,000.00</Text>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: '0%' }]} />
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.card, styles.transactionsCard]}>
          <View style={styles.cardRow}> 
            <Text style={styles.cardTitle}>Transacciones recientes</Text>
            <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.small}>Últimas 5 transacciones registradas</Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No hay transacciones este mes.</Text>
          </View>
        </View>
      </ScrollView>
      </ScrollView>


      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="#FFFFFF" />
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="credit-card" size={24} color="#FFFFFF" />
          <Text style={styles.navText}>Transacciones</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="stats-chart-outline" size={24} color="#FFFFFF" />
          <Text style={styles.navText}>Estadísticas</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="account-balance-wallet" size={24} color="#FFFFFF" />
          <Text style={styles.navText}>Presupuestos</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#E9F9F0',
  },
   scroll: { 
    flex: 1,
  },
    scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 80,
    paddingTop: 20,
  },
  container: {
    flex: 1, 
    backgroundColor: '#E8F3EC' 
  },
header: { 
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
  icono: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
  logoText: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#0D7A43', // VERDE como en tu imagen
  },
  profileIcon: {
    // El ícono de perfil se alinea a la derecha automáticamente
  },


  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  amount: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 8,
    color: '#0F172A',
  },
  small: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
  },
  trendUp: {
    color: '#10B981',
    fontSize: 18,
  },
  trendDown: {
    color: '#EF4444',
    fontSize: 18,
  },
  balanceSign: {
    color: '#059669',
    fontSize: 20,
  },

  budgetCard: {
    paddingBottom: 20,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
  },
  bullet: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F87171',
    marginTop: 6,
  },
  budgetInfo: {
    flex: 1,
    marginLeft: 12,
  },
  budgetLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  budgetNumbers: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#60A5FA',
  },

  transactionsCard: {
    paddingBottom: 32,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#06B6D4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  emptyState: {
    marginTop: 16,
    paddingVertical: 24,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  emptyText: {
    color: '#9CA3AF',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2FB16B',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderTopWidth: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 4,
    fontWeight: '500',
  },
});
