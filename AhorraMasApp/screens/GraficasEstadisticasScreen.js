import React, { useState, useCallback } from "react";
import { 
  View, Text, StyleSheet, ScrollView, Image, StatusBar, Dimensions, TouchableOpacity 
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { PieChart, BarChart, LineChart } from "react-native-chart-kit"; // IMPORTAR LineChart
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react-native';

import { TransaccionController } from '../controllers/TransaccionController';
import { PresupuestoController } from '../controllers/PresupuestoController';

const screenWidth = Dimensions.get("window").width;
const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

export default function GraficasEstadisticasScreen({ navigation }) {
  const [userName, setUserName] = useState('Usuario');
  const now = new Date();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  
  const [pieData, setPieData] = useState([]);
  const [totalGastos, setTotalGastos] = useState(0);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [budgetAnalysis, setBudgetAnalysis] = useState([]);
  
  // Estado para datos de la gráfica de líneas
  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [{ data: [0] }, { data: [0] }] // Inicializar para evitar errores de render
  });

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
        const searchMonth = mesNombre.toLowerCase();
        const searchYear = anioStr;

        const allTransactions = await transaccionController.obtenerTodas(userId);
        
        // Filtrar transacciones del mes
        const monthTransactions = allTransactions.filter(t => {
          const tFecha = t.fecha.toLowerCase(); 
          return tFecha.includes(searchMonth) && tFecha.includes(searchYear);
        });

        // --- LÓGICA GENERAL (Totales y PieChart) ---
        let ingresosMes = 0;
        let gastosMes = 0;
        const categoryMap = {};

        monthTransactions.forEach(t => {
          const monto = Math.abs(t.monto);
          if (t.tipo === 'income' || (t.monto > 0 && t.tipo !== 'expense')) {
            ingresosMes += monto;
          } else {
            gastosMes += monto;
            const catKey = t.categoria.trim(); 
            const catDisplay = catKey.charAt(0).toUpperCase() + catKey.slice(1).toLowerCase();
            categoryMap[catDisplay] = (categoryMap[catDisplay] || 0) + monto;
          }
        });

        setTotalIngresos(ingresosMes);
        setTotalGastos(gastosMes);

        // --- LÓGICA PARA GRÁFICA DE LÍNEAS (FLUJO DIARIO) ---
        // 1. Determinar días del mes actual
        const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
        const daysLabels = [];
        const dailyIncome = new Array(daysInMonth).fill(0);
        const dailyExpense = new Array(daysInMonth).fill(0);

        // 2. Llenar etiquetas (e.g., 1, 5, 10, 15...) para no saturar
        for (let i = 1; i <= daysInMonth; i++) {
          daysLabels.push(i % 5 === 0 || i === 1 ? i.toString() : ""); // Solo etiquetar algunos días
        }

        // 3. Llenar datos diarios
        monthTransactions.forEach(t => {
          // Asumimos formato "30 de noviembre de 2025" -> split por espacio -> "30" es el índice 0
          const dayStr = t.fecha.split(' ')[0]; 
          const dayIndex = parseInt(dayStr, 10) - 1; // Array base 0

          if (dayIndex >= 0 && dayIndex < daysInMonth) {
            const monto = Math.abs(t.monto);
            if (t.tipo === 'income' || (t.monto > 0 && t.tipo !== 'expense')) {
              dailyIncome[dayIndex] += monto;
            } else {
              dailyExpense[dayIndex] += monto;
            }
          }
        });

        setLineData({
          labels: daysLabels,
          legend: ["Ingresos", "Gastos"],
          datasets: [
            {
              data: dailyIncome,
              color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, // Verde
              strokeWidth: 2
            },
            {
              data: dailyExpense,
              color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // Rojo
              strokeWidth: 2
            }
          ]
        });

        // Configuración PieChart
        const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];
        let colorIndex = 0;
        const pData = Object.keys(categoryMap).map(cat => ({
          name: cat,
          population: categoryMap[cat],
          color: colors[colorIndex++ % colors.length],
          legendFontColor: "#7F7F7F",
          legendFontSize: 12
        }));
        setPieData(pData);
        
        // Presupuestos
        const budgets = await presupuestoController.obtenerConGasto(userId, mesNombre, anioStr);
        setBudgetAnalysis(budgets);
      }
    } catch (error) { console.error(error); }
  };

  useFocusEffect(useCallback(() => { loadData(); }, [currentMonthIndex, currentYear]));

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`, // Color de etiquetas
    labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
    strokeWidth: 2, 
    barPercentage: 0.7,
    decimalPlaces: 0,
  };

  const barChartData = {
    labels: ["Ingresos", "Gastos"],
    datasets: [{ data: [totalIngresos, totalGastos] }]
  };

  const formatMoney = (amount) => `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
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

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, {backgroundColor: '#D1FAE5'}]}>
            <Text style={[styles.summaryLabel, {color: '#065F46'}]}>Ingresos</Text>
            <Text style={[styles.summaryAmount, {color: '#065F46'}]}>${totalIngresos.toLocaleString()}</Text>
          </View>
          <View style={[styles.summaryCard, {backgroundColor: '#FEE2E2'}]}>
            <Text style={[styles.summaryLabel, {color: '#991B1B'}]}>Gastos</Text>
            <Text style={[styles.summaryAmount, {color: '#991B1B'}]}>${totalGastos.toLocaleString()}</Text>
          </View>
        </View>

        {/* GRÁFICA DE BARRAS (BALANCE) */}
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Balance General</Text>
          {totalIngresos > 0 || totalGastos > 0 ? (
            <BarChart
              data={barChartData}
              width={screenWidth - 60}
              height={220}
              yAxisLabel="$"
              chartConfig={{...chartConfig, color: (opacity = 1) => `rgba(13, 122, 67, ${opacity})`}}
              verticalLabelRotation={0}
              fromZero={true}
              showValuesOnTopOfBars={true}
            />
          ) : (
            <Text style={styles.emptyText}>Sin movimientos este mes.</Text>
          )}
        </View>

        {/* NUEVA GRÁFICA DE LÍNEAS (FLUJO DIARIO) */}
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Flujo Diario</Text>
          {totalIngresos > 0 || totalGastos > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <LineChart
                data={lineData}
                width={screenWidth + 100} // Un poco más ancha para que se vea bien
                height={220}
                chartConfig={{
                  ...chartConfig,
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: { borderRadius: 16 }
                }}
                bezier // Líneas curvas
                style={{ marginVertical: 8, borderRadius: 16 }}
              />
            </ScrollView>
          ) : (
            <Text style={styles.emptyText}>Registra movimientos para ver el flujo.</Text>
          )}
        </View>

        {/* GRÁFICA DE PASTEL */}
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Gastos por Categoría</Text>
          {pieData.length > 0 ? (
            <PieChart 
              data={pieData} 
              width={screenWidth - 40} 
              height={220} 
              chartConfig={chartConfig} 
              accessor={"population"} 
              backgroundColor={"transparent"} 
              paddingLeft={"15"} 
              center={[0, 0]} 
              absolute 
            />
          ) : (
            <Text style={styles.emptyText}>No hay gastos registrados.</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Estado de Presupuestos</Text>
        {budgetAnalysis.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No hay presupuestos definidos para este mes.</Text>
          </View>
        ) : (
          budgetAnalysis.map((b, i) => {
            const percent = Math.min((b.monto_gastado / b.monto_limite) * 100, 100);
            
            // Alerta visual
            const isExceeded = (b.monto_gastado || 0) >= b.monto_limite;
            const color = isExceeded ? '#EF4444' : percent > 80 ? '#F59E0B' : '#10B981';
            
            return (
              <View 
                key={i} 
                style={[styles.budgetRow, isExceeded && styles.budgetRowExceeded]} 
              >
                <View style={{flex:1}}>
                  <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:5}}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                      <Text style={styles.catName}>{b.categoria}</Text>
                      {isExceeded && <AlertTriangle size={14} color="#EF4444" style={{marginLeft:5}} />}
                    </View>
                    <Text style={[styles.catPercent, {color}]}>{percent.toFixed(0)}%</Text>
                  </View>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${percent}%`, backgroundColor: color }]} />
                  </View>
                  <Text style={styles.catLimit}>
                    {formatMoney(b.monto_gastado)} de {formatMoney(b.monto_limite)}
                  </Text>
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
  header: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E0E0E0', elevation: 2 },
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

  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  summaryCard: { width: '48%', padding: 15, borderRadius: 12, alignItems: 'center', elevation: 1 },
  summaryLabel: { fontSize: 14, fontWeight: '600', marginBottom: 5 },
  summaryAmount: { fontSize: 18, fontWeight: 'bold' },

  chartCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 24, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#374151', marginBottom: 15, alignSelf: 'flex-start', width: '100%' },
  emptyText: { color: '#9CA3AF', fontStyle: 'italic', marginTop: 10, textAlign: 'center', width: '100%' },
  emptyCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed' },
  
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  
  // ESTILOS DE PRESUPUESTO
  budgetRow: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 12, elevation: 1, borderWidth: 1, borderColor: 'transparent' },
  budgetRowExceeded: { borderColor: '#EF4444', backgroundColor: '#FFF5F5' },
  
  catName: { fontWeight: '700', color: '#374151', fontSize: 15 },
  catPercent: { fontWeight: '700', fontSize: 14 },
  barBg: { height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, width: '100%', marginBottom: 6 },
  barFill: { height: '100%', borderRadius: 4 },
  catLimit: { fontSize: 12, color: '#6B7280', textAlign: 'right' },
});