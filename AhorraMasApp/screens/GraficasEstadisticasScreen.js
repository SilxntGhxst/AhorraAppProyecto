import React, { useState, useCallback } from "react";
import { 
  View, Text, StyleSheet, ScrollView, Image, StatusBar, Dimensions, TouchableOpacity 
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { PieChart } from "react-native-chart-kit";
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

// 1. IMPORTAR CONTROLADORES
import { TransaccionController } from '../controllers/TransaccionController';
import { PresupuestoController } from '../controllers/PresupuestoController';

const screenWidth = Dimensions.get("window").width;
const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

export default function GraficasEstadisticasScreen({ navigation }) {
  const [userName, setUserName] = useState('Usuario');
  const now = new Date();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  
  const [chartData, setChartData] = useState([]);
  const [totalGastos, setTotalGastos] = useState(0);
  const [budgetAnalysis, setBudgetAnalysis] = useState([]);

  // 2. INSTANCIAR CONTROLADORES
  const transaccionController = new TransaccionController();
  const presupuestoController = new PresupuestoController();

  const getMonthName = (index) => months[index];

  const changeMonth = (inc) => {
    let newIndex = currentMonthIndex + inc;
    let newYear = currentYear;
    if (newIndex > 11) { newIndex = 0; newYear++; } else if (newIndex < 0) { newIndex = 11; newYear--; }
    setCurrentMonthIndex(newIndex); setCurrentYear(newYear);
  };

  const loadData = async () => {
    try {
      const userId = await SecureStore.getItemAsync('user_id');
      const name = await SecureStore.getItemAsync('user_name');
      if (name) setUserName(name.split(' ')[0]);

      if (userId) {
        const mesNombre = getMonthName(currentMonthIndex);
        const anioStr = currentYear.toString();

        // 3. OBTENER DATOS VIA CONTROLADOR
        const allTransactions = await transaccionController.obtenerTodas(userId);
        const filteredTrans = allTransactions.filter(t => 
          (t.tipo === 'expense' || t.monto < 0) &&
          t.fecha.includes(mesNombre) && t.fecha.includes(anioStr)
        );

        const categoryMap = {};
        let total = 0;
        filteredTrans.forEach(t => {
          const amount = Math.abs(t.monto);
          categoryMap[t.categoria] = (categoryMap[t.categoria] || 0) + amount;
          total += amount;
        });

        const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
        let colorIndex = 0;
        const data = Object.keys(categoryMap).map(cat => ({
          name: cat, population: categoryMap[cat], color: colors[colorIndex++ % colors.length], legendFontColor: "#7F7F7F", legendFontSize: 12
        }));

        setChartData(data);
        setTotalGastos(total);
        
        // 4. OBTENER PRESUPUESTOS
        const budgets = await presupuestoController.obtenerConGasto(userId, mesNombre, anioStr);
        setBudgetAnalysis(budgets);
      }
    } catch (error) { console.error(error); }
  };

  useFocusEffect(useCallback(() => { loadData(); }, [currentMonthIndex, currentYear]));

  const chartConfig = { backgroundGradientFrom: "#1E2923", backgroundGradientFromOpacity: 0, backgroundGradientTo: "#08130D", backgroundGradientToOpacity: 0.5, color: (opacity = 1) => `rgba(13, 122, 67, ${opacity})` };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* HEADER CONSISTENTE */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>     
          <Image source={require('../assets/Puerquito2.jpg')} style={styles.logoIcon} />
          <View>
            <Text style={styles.greeting}>Hola, {userName}</Text>
            <Text style={styles.subGreeting}>Reportes</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Perfil')} style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={34} color="#0D7A43" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>Análisis Mensual</Text>

        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.arrowBtn}><ChevronLeft size={24} color="#374151" /></TouchableOpacity>
          <Text style={styles.monthText}>{getMonthName(currentMonthIndex)} {currentYear}</Text>
          <TouchableOpacity onPress={() => changeMonth(1)} style={styles.arrowBtn}><ChevronRight size={24} color="#374151" /></TouchableOpacity>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Gastado</Text>
          <Text style={styles.summaryAmount}>${totalGastos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</Text>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Por Categoría</Text>
          {chartData.length > 0 ? (
            <PieChart data={chartData} width={screenWidth - 60} height={220} chartConfig={chartConfig} accessor={"population"} backgroundColor={"transparent"} paddingLeft={"0"} center={[10, 0]} absolute />
          ) : (
            <Text style={styles.emptyText}>No hay gastos registrados.</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Presupuestos</Text>
        {budgetAnalysis.length === 0 ? (
          <Text style={styles.emptyText}>No hay datos de presupuesto.</Text>
        ) : (
          budgetAnalysis.map((b, i) => {
            const percent = Math.min((b.monto_gastado / b.monto_limite) * 100, 100);
            const color = percent >= 100 ? '#EF4444' : '#10B981';
            return (
              <View key={i} style={styles.budgetRow}>
                <View style={{flex:1}}>
                  <Text style={styles.catName}>{b.categoria}</Text>
                  <View style={styles.barBg}><View style={[styles.barFill, { width: `${percent}%`, backgroundColor: color }]} /></View>
                </View>
                <View style={{alignItems: 'flex-end', marginLeft: 10}}>
                  <Text style={[styles.catSpent, {color}]}>${b.monto_gastado}</Text>
                  <Text style={styles.catLimit}>/ ${b.monto_limite}</Text>
                </View>
              </View>
            );
          })
        )}
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

  scrollContent: { padding: 20, paddingBottom: 100 },
  screenTitle: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 20 },
  monthSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, padding: 10, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  monthText: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  arrowBtn: { padding: 5 },
  summaryCard: { backgroundColor: '#0D7A43', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 20, shadowOpacity: 0.2, elevation: 5 },
  summaryLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  summaryAmount: { color: '#FFF', fontSize: 32, fontWeight: '800', marginTop: 5 },
  chartCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 24, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#374151', marginBottom: 10, alignSelf: 'flex-start' },
  emptyText: { color: '#9CA3AF', fontStyle: 'italic', marginTop: 10, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  budgetRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 12, borderRadius: 12, marginBottom: 10 },
  catName: { fontWeight: '600', color: '#374151', marginBottom: 5 },
  barBg: { height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, width: '100%' },
  barFill: { height: '100%', borderRadius: 3 },
  catSpent: { fontWeight: '700', fontSize: 14 },
  catLimit: { fontSize: 12, color: '#9CA3AF' },
});