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
  Plus,
  Edit2,
  Trash2
} from 'lucide-react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const PresupuestosMensuales = () => {
  const [selectedMonth, setSelectedMonth] = useState('Septiembre');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [showEmpty, setShowEmpty] = useState(false);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const budgets = [
    {
      id: 1,
      category: 'Alimentación',
      icon: '🍔',
      limit: 8000,
      spent: 5200,
      color: '#10B981',
    },
    {
      id: 2,
      category: 'Transporte',
      icon: '🚗',
      limit: 3000,
      spent: 2850,
      color: '#3B82F6',
    },
    {
      id: 3,
      category: 'Entretenimiento',
      icon: '🎬',
      limit: 2500,
      spent: 2800,
      color: '#F59E0B',
    },
    {
      id: 4,
      category: 'Servicios',
      icon: '💡',
      limit: 4000,
      spent: 3500,
      color: '#8B5CF6',
    },
  ];

  const calculatePercentage = (spent, limit) => {
    return Math.min((spent / limit) * 100, 100);
  };

  const getStatusColor = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return '#EF4444';
    if (percentage >= 80) return '#F59E0B';
    return '#10B981';
  };

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
        {/* Sección título */}
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

        {/* Resumen General */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen General</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Presupuestado</Text>
              <Text style={styles.summaryAmount}>$17,500.00</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Gastado</Text>
              <Text style={[styles.summaryAmount, { color: '#EF4444' }]}>$14,350.00</Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: '82%' }]} />
          </View>
          <Text style={styles.progressText}>82% del presupuesto total utilizado</Text>
        </View>

        {/* Lista de Presupuestos */}
        {showEmpty ? (
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
        ) : (
          <>
            {budgets.map((budget) => {
              const percentage = calculatePercentage(budget.spent, budget.limit);
              const statusColor = getStatusColor(budget.spent, budget.limit);
              const remaining = budget.limit - budget.spent;

              return (
                <View key={budget.id} style={styles.budgetCard}>
                  <View style={styles.budgetHeader}>
                    <View style={styles.budgetLeft}>
                      <View style={[styles.categoryIcon, { backgroundColor: budget.color + '20' }]}>
                        <Text style={styles.categoryEmoji}>{budget.icon}</Text>
                      </View>
                      <View style={styles.budgetInfo}>
                        <Text style={styles.categoryName}>{budget.category}</Text>
                        <Text style={styles.budgetSubtext}>
                          ${budget.spent.toLocaleString('es-MX', { minimumFractionDigits: 2 })} de ${budget.limit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.budgetActions}>
                      <TouchableOpacity style={styles.actionButton}>
                        <Edit2 size={20} color="#6B7280" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <Trash2 size={20} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.budgetProgressContainer}>
                    <View style={styles.budgetProgressBar}>
                      <View 
                        style={[
                          styles.budgetProgress, 
                          { 
                            width: `${percentage}%`,
                            backgroundColor: statusColor 
                          }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.percentageText, { color: statusColor }]}>
                      {percentage.toFixed(0)}%
                    </Text>
                  </View>

                  <View style={styles.budgetFooter}>
                    {remaining >= 0 ? (
                      <Text style={styles.remainingText}>
                        Disponible: <Text style={{ color: '#10B981', fontWeight: '600' }}>
                          ${remaining.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </Text>
                      </Text>
                    ) : (
                      <Text style={styles.remainingText}>
                        Excedido: <Text style={{ color: '#EF4444', fontWeight: '600' }}>
                          ${Math.abs(remaining).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </Text>
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </>
        )}

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
  profileIcon: {},
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
  summaryCard: {
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  budgetCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  budgetInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  budgetSubtext: {
    fontSize: 13,
    color: '#6B7280',
  },
  budgetActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 8,
  },
  budgetProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  budgetProgress: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 45,
    textAlign: 'right',
  },
  budgetFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  remainingText: {
    fontSize: 14,
    color: '#6B7280',
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