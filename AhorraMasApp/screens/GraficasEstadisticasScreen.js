import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PieChart } from "react-native-chart-kit";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { getTransactions } from "../services/DBService";

const screenWidth = Dimensions.get("window").width;

export default function GraficasEstadisticasScreen() {
  const [chartData, setChartData] = useState([]);
  const [totalGastos, setTotalGastos] = useState(0);

  const processTransactions = (transactions) => {
    const categoryMap = {};
    let total = 0;

    transactions.forEach((t) => {
      if (t.tipo === "expense" || t.monto < 0) {
        const amount = Math.abs(t.monto);
        if (categoryMap[t.categoria]) categoryMap[t.categoria] += amount;
        else categoryMap[t.categoria] = amount;
        total += amount;
      }
    });

    const colors = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];
    let colorIndex = 0;

    const data = Object.keys(categoryMap).map((cat) => {
      const color = colors[colorIndex % colors.length];
      colorIndex++;
      return {
        name: cat,
        population: categoryMap[cat],
        color: color,
        legendFontColor: "#7F7F7F",
        legendFontSize: 12,
      };
    });

    setChartData(data);
    setTotalGastos(total);
  };

  const loadData = async () => {
    const userId = await SecureStore.getItemAsync("user_id");
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
          <Image
            source={require("../assets/Puerquito2.jpg")}
            style={styles.icono}
          />
          <Text style={styles.logoText}>Ahorra +App</Text>
        </View>
        <View style={styles.profileIcon}>
          <Ionicons name="person-circle-outline" size={32} color="#0D7A43" />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.title}>Gráficas y Estadísticas</Text>
        <Text style={styles.subtitle}>
          Tus gastos totales: ${totalGastos.toFixed(2)}
        </Text>
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
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={styles.emptyText}>
                No hay datos de gastos para mostrar.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F3EC" },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContent: { flexDirection: "row", alignItems: "center" },
  icono: { width: 35, height: 35, marginRight: 10 },
  logoText: { fontSize: 20, fontWeight: "bold", color: "#0D7A43" },
  sectionHeader: { paddingHorizontal: 16, marginTop: 8, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: "600", color: "#222" },
  subtitle: { fontSize: 14, color: "#666" },
  content: { paddingHorizontal: 16, paddingBottom: 80 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    shadowOpacity: 0.05,
    elevation: 2,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  emptyText: { color: "#999", fontStyle: "italic", marginTop: 5 },
});
