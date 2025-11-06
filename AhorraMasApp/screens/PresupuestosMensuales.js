import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ScrollView,
  Image
} from 'react-native';
import { 
  ChevronDown,
  Plus
} from 'lucide-react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const PresupuestosMensuales = () => {
  const [selectedMonth, setSelectedMonth] = useState('Septiembre');
  const [selectedYear, setSelectedYear] = useState('2025');

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <View style={styles.container}>
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

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Seccion titulo */}
        <View style={styles.titleSection}>
          <View>
            <Text style={styles.titleText}>Presupuestos</Text>
            <Text style={styles.titleText}>Mensuales</Text>
            <Text style={styles.subtitleText}>
              Gestiona tus límites de gasto{'\n'}por categoría
            </Text>
          </View>
          <TouchableOpacity style={styles.newBudgetButton}>
            <Text style={styles.newBudgetText}>Nuevo Presupuesto</Text>
          </TouchableOpacity>
        </View>

        {/* Selector de periodo */}
        <View style={styles.periodCard}>
          <Text style={styles.periodLabel}>Periodo</Text>
          
          <View style={styles.selectorsRow}>
            <TouchableOpacity style={styles.selector}>
              <Text style={styles.selectorText}>{selectedMonth}</Text>
              <ChevronDown size={20} color="#1F2937" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.selector}>
              <Text style={styles.selectorText}>{selectedYear}</Text>
              <ChevronDown size={20} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Card de estado vacio */}
        <View style={styles.emptyStateCard}>
          <View style={styles.emptyIconContainer}>
            <View style={styles.emptyIconCircle}>
              <View style={styles.logoCircleSmall}>
                <Text style={styles.logoPlusSmall}>+</Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.emptyStateText}>
            No tienes presupuestos configurados{'\n'}para Septiembre 2025
          </Text>
          
          <TouchableOpacity style={styles.createButton}>
            <Plus size={20} color="white" />
            <Text style={styles.createButtonText}>Crear Primer Presupuesto</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F3EC',
  },
  // HEADER - Igual que PerfilScreen
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
    color: '#0D7A43',
  },
  profileIcon: {
    // El ícono de perfil se alinea a la derecha automáticamente
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleSection: {
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 34,
  },
  subtitleText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    lineHeight: 20,
  },
  newBudgetButton: {
    backgroundColor: '#475569',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  newBudgetText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  periodCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  periodLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  selectorsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  selector: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
  emptyStateCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircleSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlusSmall: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  emptyStateText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  createButton: {
    backgroundColor: '#475569',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 80,
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

export default PresupuestosMensuales;