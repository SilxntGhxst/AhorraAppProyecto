import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function GraficasEstadisticasScreen() {
  return (
    <SafeAreaView style={styles.container}>
      /* Encabezado */
      <View style={styles.header}>
                  <Image
                        source={require('../assets/piglogo.png')}
                        style={styles.icono}
                      />
        <Text style={styles.logoText}> Ahorra +App</Text>
        <View style={styles.profileIcon}>
          <Ionicons name="person-circle-outline" size={32} color="#0D7A43" />
        </View>
      </View>

      /* Título y descripción */
      <View style={styles.sectionHeader}>
        <Text style={styles.title}>Gráficas y Estadísticas</Text>
        <Text style={styles.subtitle}>
          Visualiza tus patrones de ingresos y gastos
        </Text>

        /* Selector de mes */
        <View style={styles.monthSelector}>
          <Text style={styles.monthText}>Septiembre</Text>
          <Ionicons name="chevron-down" size={18} color="#555" />
        </View>
      </View>

      /* Pestañas */
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, styles.tabActive]}>
          <Text style={[styles.tabText, styles.tabTextActive]}>Por Categorías</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Comparación</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Tendencia</Text>
        </TouchableOpacity>
      </View>

      /* Cuerpo scrollable */
      <ScrollView contentContainerStyle={styles.content}>
        /* Tarjeta de gastos */
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📉 Gastos por Categoría</Text>
          <Text style={styles.cardSubtitle}>
            Distribución de gastos en Septiembre 2025
          </Text>
          <Text style={styles.emptyText}>
            No hay gastos registrados en este periodo
          </Text>
        </View>

        /* Tarjeta de ingresos */
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📈 Ingresos por Categoría</Text>
          <Text style={styles.cardSubtitle}>
            Distribución de ingresos en Septiembre 2025
          </Text>
          <Text style={styles.emptyText}>
            No hay ingresos registrados en este periodo
          </Text>
        </View>
      </ScrollView>

      /* Barra de navegación inferior */
      <View style={styles.bottomNav}>
        <Ionicons name="home-outline" size={24} color="#0D7A43" />
        <Ionicons name="document-text-outline" size={24} color="#0D7A43" />
        <Ionicons name="stats-chart" size={26} color="#0D7A43" />
        <Ionicons name="settings-outline" size={24} color="#0D7A43" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F8EE",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0D7A43",
  },
  profileIcon: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  monthText: {
    fontSize: 14,
    color: "#333",
    marginRight: 4,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#DFF5E3",
    marginVertical: 12,
    borderRadius: 10,
    marginHorizontal: 8,
    paddingVertical: 4,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  tabActive: {
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  tabText: {
    fontSize: 13,
    color: "#666",
  },
  tabTextActive: {
    color: "#0D7A43",
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  emptyText: {
    fontSize: 13,
    color: "#888",
    marginTop: 12,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#DFF5E3",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#CDEED4",
  },
});
