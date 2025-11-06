import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";

// IMPORTA TUS SCREENS AQUÍ
import IniciarSesionScreen from "./IniciarSesionScreen";
import RegistrarScreen from "./RegistrarScreen";
import TransactionsScreen from "./TransactionsScreen";
import MonthlyBudgetsScreen from "./MonthlyBudgetsScreen";
import GraficasEstadisticasScreen from "./GraficasEstadisticasScreen";
// import TuOtraScreen from './TuOtraScreen';

export default function MenuScreen() {
  const [screen, setScreen] = useState("menu");

  switch (screen) {
    case "IniciarSesion":
      return <IniciarSesionScreen />;

    case "Registrar":
      return <RegistrarScreen />;

    case "Transacciones":
      return <TransactionsScreen />;

    case "Presupuestos":
      return <MonthlyBudgetsScreen />;
    case"Graficas":
     return <GraficasEstadisticasScreen/>

    // AÑADE MÁS CASES AQUÍ SEGÚN NECESITES
    // case 'TuOtraScreen':
    //   return <TuOtraScreen />;

    default:
      return (
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#E8F5F0" />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoPlus}>+</Text>
              </View>
              <Text style={styles.logoText}>Ahorra +App</Text>
            </View>
            <View style={styles.profileButton}>
              <View style={styles.profileCircle}>
                <Text style={styles.profileEmoji}>👤</Text>
              </View>
            </View>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.titleSection}>
              <Text style={styles.titleText}>Menú Principal</Text>
              <Text style={styles.subtitleText}>
                Selecciona una pantalla para navegar
              </Text>
            </View>

            <View style={styles.menuCard}>
              <Text style={styles.cardTitle}>Navegación de Screens</Text>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => setScreen("IniciarSesion")}
                >
                  <View style={styles.buttonIcon}>
                    <Text style={styles.buttonIconText}>🔐</Text>
                  </View>
                  <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => setScreen("Registrar")}
                >
                  <View style={styles.buttonIcon}>
                    <Text style={styles.buttonIconText}>📝</Text>
                  </View>
                  <Text style={styles.buttonText}>Registrar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => setScreen("Transacciones")}
                >
                  <View style={styles.buttonIcon}>
                    <Text style={styles.buttonIconText}>💰</Text>
                  </View>
                  <Text style={styles.buttonText}>Transacciones</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => setScreen("Presupuestos")}
                >
                  <View style={styles.buttonIcon}>
                    <Text style={styles.buttonIconText}>🎯</Text>
                  </View>
                  <Text style={styles.buttonText}>Presupuestos Mensuales</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.menuButton}
                  onPress={() => setScreen('Graficas')}
                >
                  <View style={styles.buttonIcon}>
                    <Text style={styles.buttonIconText}>🏠</Text>
                  </View>
                  <Text style={styles.buttonText}>Graficas y Estadisticas</Text>
                </TouchableOpacity>

                {/* AÑADE MÁS BOTONES AQUÍ */}
                {/* 
                <TouchableOpacity 
                  style={styles.menuButton}
                  onPress={() => setScreen('TuOtraScreen')}
                >
                  <View style={styles.buttonIcon}>
                    <Text style={styles.buttonIconText}>🏠</Text>
                  </View>
                  <Text style={styles.buttonText}>Tu Otra Screen</Text>
                </TouchableOpacity>
                */}
              </View>
            </View>
          </ScrollView>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5F0",
  },
  header: {
    backgroundColor: "#E8F5F0",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  logoPlus: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#10B981",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  profileCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },
  profileEmoji: {
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  titleSection: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  titleText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 22,
  },
  menuCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 20,
  },
  buttonsContainer: {
    gap: 12,
  },
  menuButton: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  buttonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  buttonIconText: {
    fontSize: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    flex: 1,
  },
});
