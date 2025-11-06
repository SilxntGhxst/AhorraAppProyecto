import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image } from "react-native";
import { Ionicons,MaterialIcons } from "@expo/vector-icons";

export default function GraficasEstadisticasScreen() {
  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <View style={styles.iconContent}>     
          <Image
                source={require('../assets/piglogo.png')}
                style={styles.icono}
              />
            <Text style={styles.logoText}> Ahorra +App</Text>
        </View>
        
        <View style={styles.profileIcon}>
          <Ionicons name="person-circle-outline" size={32} color="#0D7A43" />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.title}>Gráficas y Estadísticas</Text>
        <Text style={styles.subtitle}>
          Visualiza tus patrones de ingresos y gastos
        </Text>

        <View style={styles.monthSelector}>
          <Text style={styles.monthText}>Septiembre</Text>
          <Ionicons name="chevron-down" size={18} color="#555" />
        </View>
      </View>

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

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Gastos por Categoría</Text>
          <Text style={styles.cardSubtitle}>
            Distribución de gastos en Septiembre 2025
          </Text>
          <Text style={styles.emptyText}>
            No hay gastos registrados en este periodo
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ingresos por Categoría</Text>
          <Text style={styles.cardSubtitle}>
            Distribución de ingresos en Septiembre 2025
          </Text>
          <Text style={styles.emptyText}>
            No hay ingresos registrados en este periodo
          </Text>
        </View>
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
    icono: {
    width: 30,
    height: 30,
  },
  iconContent:{
    flexDirection:"row",
    alignItems:"center",
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2FB16B', // VERDE
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderTopWidth: 0,
    // Asegurar que el verde sea sólido
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
    color: '#FFFFFF', // Texto blanco
    marginTop: 4,
    fontWeight: '500',
  },
});
