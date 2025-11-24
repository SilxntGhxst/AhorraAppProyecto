// screens/GraficasEstadisticasScreen.js

import React, { useState, useCallback } from "react";
import {  View,  Text,  StyleSheet,  ScrollView,  SafeAreaView, Image, StatusBar,  Dimensions} from "react-native";
import { Ionicons } from "@expo/vector-icons";


import { PieChart } from "react-native-chart-kit";


import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { getTransactions } from '../services/DBService'; 

const screenWidth = Dimensions.get("window").width;

export default function GraficasEstadisticasScreen() {

  const [chartData, setChartData] = useState([]);
  const [totalGastos, setTotalGastos] = useState(0);


  const processTransactions = (transactions) => {
    const categoryMap = {};
    let total = 0;

    transactions.forEach(t => {
    
      if (t.tipo === 'expense' || t.monto < 0) {
        const amount = Math.abs(t.monto);
        if (categoryMap[t.categoria]) {
          categoryMap[t.categoria] += amount;
        } else {
          categoryMap[t.categoria] = amount;
        }
        total += amount;
      }
    });

   
    const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];
    let colorIndex = 0;

    const data = Object.keys(categoryMap).map(cat => {
      const color = colors[colorIndex % colors.length];
      colorIndex++;
      return {
        name: cat,
        population: categoryMap[cat], 
        color: color,
        legendFontColor: "#7F7F7F",
        legendFontSize: 12
      };
    });

    setChartData(data);
    setTotalGastos(total);
  };

  const loadData = async () => {
    const userId = await SecureStore.getItemAsync('user_id');
    if (userId) {
      const transactions = await getTransactions(userId);
      processTransactions(transactions);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  
  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, 
    barPercentage: 0.5,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
     
      <View style={styles.header}>
        <View style={styles.iconContent}>     
          <Image source={require('../assets/Puerquito2.jpg')} style={styles.icono} />
          <Text style={styles.logoText}>Ahorra +App</Text>
        </View>
        <View style={styles.profileIcon}>
          <Ionicons name="person-circle-outline" size={32} color="#0D7A43" />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.title}>Gráficas y Estadísticas</Text>
        <Text style={styles.subtitle}>Tus gastos este mes: ${totalGastos.toFixed(2)}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Distribución de Gastos</Text>
          
          {chartData.length > 0 ? (
            <PieChart
              data={chartData}
              width={screenWidth - 40} 
              height={220}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              center={[10, 0]}
              absolute
            />
          ) : (
            <View style={{padding: 20, alignItems: 'center'}}>
              <Text style={styles.emptyText}>No hay datos de gastos para mostrar.</Text>
              <Text style={styles.emptyText}>Agrega transacciones primero.</Text>
            </View>
          )}
        </View>

       
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resumen</Text>
          <Text style={styles.cardSubtitle}>
            La categoría donde más gastas es: 
            {chartData.length > 0 
              ? " " + chartData.sort((a,b) => b.population - a.population)[0].name 
              : " -"}
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  
  container: {
    flex: 1, 
    backgroundColor: '#E8F3EC' 
  },
 
  content: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center' 
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: 'flex-start'
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
  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 10
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
    marginTop: 5
  }
});