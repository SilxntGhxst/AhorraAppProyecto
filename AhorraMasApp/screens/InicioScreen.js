import React, { useState, useCallback } from 'react';
import { 
  ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

// 1. IMPORTAR LOS NUEVOS CONTROLADORES
import { TransaccionController } from '../controllers/TransaccionController';
import { PresupuestoController } from '../controllers/PresupuestoController';

export default function AhorraAppScreen({ navigation }) {
  const [userName, setUserName] = useState('Usuario');
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);

  // 2. INSTANCIAR CONTROLADORES
  const transaccionController = new TransaccionController();
  const presupuestoController = new PresupuestoController();

  const loadDashboardData = async () => {
    try {
      const userId = await SecureStore.getItemAsync('user_id');
      const name = await SecureStore.getItemAsync('user_name');
      if (name) setUserName(name.split(' ')[0]);

      if (userId) {
        // 3. USAR EL CONTROLADOR DE TRANSACCIONES
        const allTransactions = await transaccionController.obtenerTodas(userId);
        
        let totalIng = 0;
        let totalGas = 0;

        allTransactions.forEach(t => {
          if (t.tipo === 'income' || (t.monto > 0 && t.tipo !== 'expense')) {
            totalIng += Math.abs(t.monto);
          } else {
            totalGas += Math.abs(t.monto);
          }
        });

        setIncome(totalIng);
        setExpense(totalGas);
        setBalance(totalIng - totalGas);
        setRecentTransactions(allTransactions.slice(0, 5));

        // 4. USAR EL CONTROLADOR DE PRESUPUESTOS
        // (Calcula automáticamente el gasto real gracias a la lógica que pusimos en el controlador)
        const allBudgets = await presupuestoController.obtenerConGasto(userId, "Septiembre", "2025");
        setBudgets(allBudgets);
      }
    } catch (error) { console.error(error); }
  };

  useFocusEffect(useCallback(() => { loadDashboardData(); }, []));

  const formatMoney = (amount) => `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}> 
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>     
          <Image source={require('../assets/Puerquito2.jpg')} style={styles.logoIcon} />
          <View>
            <Text style={styles.greeting}>Hola, {userName}</Text>
            <Text style={styles.subGreeting}>Ahorra +App</Text>
          </View>
        </View>
        
        <TouchableOpacity onPress={() => navigation.navigate('Perfil')} style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={34} color="#0D7A43" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* TARJETA PRINCIPAL */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Balance Total</Text>
            <Ionicons name="wallet" size={20} color="rgba(255,255,255,0.8)" />
          </View>
          
          <Text style={styles.balanceAmount}>{formatMoney(balance)}</Text>
          
          <View style={styles.balanceRow}>
            <View style={styles.balanceItem}>
              <View style={[styles.iconCircle, { backgroundColor: '#D1FAE5' }]}>
                <Ionicons name="arrow-up" size={18} color="#10B981" />
              </View>
              <View>
                <Text style={styles.balanceItemLabel}>Ingresos</Text>
                <Text style={styles.balanceItemValue}>{formatMoney(income)}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.balanceItem}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="arrow-down" size={18} color="#EF4444" />
              </View>
              <View>
                <Text style={styles.balanceItemLabel}>Gastos</Text>
                <Text style={styles.balanceItemValue}>{formatMoney(expense)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ACCESOS RÁPIDOS */}
        <Text style={styles.sectionTitle}>Accesos Rápidos</Text>
        <View style={styles.quickAccessRow}>
          <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.navigate('Transacciones')}>
            <View style={[styles.quickIcon, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="swap-horizontal" size={24} color="#0284C7" />
            </View>
            <Text style={styles.quickText}>Movimientos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.navigate('Presupuestos')}>
            <View style={[styles.quickIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="pie-chart" size={24} color="#D97706" />
            </View>
            <Text style={styles.quickText}>Presupuestos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.navigate('Gráficas')}>
            <View style={[styles.quickIcon, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="stats-chart" size={24} color="#16A34A" />
            </View>
            <Text style={styles.quickText}>Reportes</Text>
          </TouchableOpacity>
        </View>

        {/* SECCIÓN PRESUPUESTOS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Estado de Presupuestos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Presupuestos')}>
            <Text style={styles.seeAll}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {budgets.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No tienes presupuestos activos este mes.</Text>
          </View>
        ) : (
          budgets.slice(0, 2).map((b, i) => { 
            const percent = Math.min(((b.monto_gastado || 0) / b.monto_limite) * 100, 100);
            const barColor = percent >= 100 ? '#EF4444' : percent > 80 ? '#F59E0B' : '#10B981';
            return (
              <TouchableOpacity key={i} style={styles.budgetCard} onPress={() => navigation.navigate('Presupuestos')}>
                <View style={styles.budgetHeaderRow}>
                  <View style={styles.budgetTitleContainer}>
                    <View style={[styles.dot, {backgroundColor: barColor}]} />
                    <Text style={styles.budgetCategory}>{b.categoria}</Text>
                  </View>
                  <Text style={[styles.budgetPercent, {color: barColor}]}>{percent.toFixed(0)}%</Text>
                </View>
                
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${percent}%`, backgroundColor: barColor }]} />
                </View>
                
                <View style={styles.budgetFooter}>
                  <Text style={styles.budgetDetails}>Gastado: {formatMoney(b.monto_gastado || 0)}</Text>
                  <Text style={styles.budgetDetails}>Límite: {formatMoney(b.monto_limite)}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        {/* TRANSACCIONES RECIENTES */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recientes</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transacciones')}>
            <Text style={styles.seeAll}>Ver más</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsContainer}>
          {recentTransactions.length === 0 ? (
            <View style={{padding: 20, alignItems: 'center'}}>
              <Text style={styles.emptyText}>No hay movimientos recientes.</Text>
            </View>
          ) : (
            recentTransactions.map((t, i) => {
              const isIncome = t.tipo === 'income' || t.monto > 0;
              return (
                <View key={i} style={styles.transactionRow}>
                  <View style={styles.transIconBg}>
                    <MaterialCommunityIcons 
                      name={t.categoria ? "tag-outline" : "cash"} 
                      size={22} 
                      color="#4B5563" 
                    />
                  </View>
                  <View style={styles.transInfo}>
                    <Text style={styles.transTitle}>{t.titulo}</Text>
                    <Text style={styles.transDate}>{t.fecha} • {t.categoria}</Text>
                  </View>
                  <Text style={[styles.transAmount, { color: isIncome ? '#10B981' : '#EF4444' }]}>
                    {isIncome ? '+' : ''}{formatMoney(t.monto)}
                  </Text>
                </View>
              );
            })
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F3EC' },
  header: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E0E0E0', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { width: 40, height: 40, marginRight: 12 },
  greeting: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  subGreeting: { fontSize: 13, color: '#0D7A43', fontWeight: '600' },
  profileButton: { padding: 4 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 },
  balanceCard: { backgroundColor: '#0D7A43', borderRadius: 20, padding: 20, marginBottom: 24, shadowColor: '#0D7A43', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, elevation: 8 },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  balanceLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '500' },
  balanceAmount: { color: '#FFF', fontSize: 34, fontWeight: '800', marginBottom: 20 },
  balanceRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 12 },
  balanceItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  iconCircle: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  balanceItemLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11 },
  balanceItemValue: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  divider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 10, height: '80%', alignSelf: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  quickAccessRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  quickBtn: { width: '31%', backgroundColor: '#FFFFFF', paddingVertical: 15, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, elevation: 3 },
  quickIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  quickText: { fontSize: 12, fontWeight: '600', color: '#374151' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 8 },
  seeAll: { color: '#0D7A43', fontWeight: '600', fontSize: 14 },
  budgetCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.03, elevation: 2 },
  budgetHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  budgetTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  budgetCategory: { fontWeight: '700', color: '#374151', fontSize: 15 },
  budgetPercent: { fontWeight: '700', fontSize: 14 },
  progressBarBg: { height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, marginBottom: 8, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  budgetFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  budgetDetails: { fontSize: 12, color: '#9CA3AF' },
  transactionsContainer: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 5, shadowColor: '#000', shadowOpacity: 0.03, elevation: 2 },
  transactionRow: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  transIconBg: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  transInfo: { flex: 1 },
  transTitle: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  transDate: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  transAmount: { fontSize: 15, fontWeight: '700' },
  emptyCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed' },
  emptyText: { color: '#9CA3AF', fontStyle: 'italic' }
});