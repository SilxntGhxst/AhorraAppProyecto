import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { ChevronDown, Plus, Edit2, Trash2, X } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { getBudgets, addBudget } from "../services/DBService";

const PresupuestosMensuales = () => {
  const [selectedMonth, setSelectedMonth] = useState("Septiembre");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [budgets, setBudgets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [newCategory, setNewCategory] = useState("");
  const [newLimit, setNewLimit] = useState("");

  const loadBudgets = async () => {
    try {
      const userId = await SecureStore.getItemAsync("user_id");
      if (userId) {
        const data = await getBudgets(userId, selectedMonth, selectedYear);
        setBudgets(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBudgets();
    }, [selectedMonth, selectedYear])
  );

  const handleSaveBudget = async () => {
    if (!newCategory || !newLimit) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }
    try {
      const userId = await SecureStore.getItemAsync("user_id");
      await addBudget(
        userId,
        newCategory,
        parseFloat(newLimit),
        selectedMonth,
        selectedYear
      );
      Alert.alert("Éxito", "Presupuesto creado");
      setModalVisible(false);
      setNewCategory("");
      setNewLimit("");
      loadBudgets();
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar");
    }
  };

  const calculatePercentage = (spent, limit) => {
    if (!limit) return 0;
    return Math.min((spent / limit) * 100, 100);
  };
  const getStatusColor = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return "#EF4444";
    if (percentage >= 80) return "#F59E0B";
    return "#10B981";
  };

  return (
    <View style={styles.container}>
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <View>
            <Text style={styles.titleText}>Presupuestos</Text>
            <Text style={styles.titleText}>Mensuales</Text>
            <Text style={styles.subtitleText}>Gestiona tus límites</Text>
          </View>
          <TouchableOpacity
            style={styles.newBudgetButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.newBudgetText}>+ Nuevo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.periodCard}>
          <Text style={styles.periodLabel}>
            Periodo: {selectedMonth} {selectedYear}
          </Text>
        </View>

        {budgets.length === 0 ? (
          <View style={styles.emptyStateCard}>
            <Text style={styles.emptyStateText}>
              No hay presupuestos definidos.
            </Text>
          </View>
        ) : (
          budgets.map((budget) => {
            const spent = budget.monto_gastado || 0;
            const limit = budget.monto_limite || 0;
            const percentage = calculatePercentage(spent, limit);
            const statusColor = getStatusColor(spent, limit);

            return (
              <View key={budget.id} style={styles.budgetCard}>
                <View style={styles.budgetHeader}>
                  <View style={styles.budgetLeft}>
                    <View
                      style={[
                        styles.categoryIcon,
                        { backgroundColor: statusColor + "20" },
                      ]}
                    >
                      <Text style={styles.categoryEmoji}>💰</Text>
                    </View>
                    <View style={styles.budgetInfo}>
                      <Text style={styles.categoryName}>
                        {budget.categoria}
                      </Text>
                      <Text style={styles.budgetSubtext}>
                        ${spent} de ${limit}
                      </Text>
                    </View>
                  </View>
                  <Trash2 size={20} color="#ccc" />
                </View>
                <View style={styles.budgetProgressContainer}>
                  <View style={styles.budgetProgressBar}>
                    <View
                      style={[
                        styles.budgetProgress,
                        {
                          width: `${percentage}%`,
                          backgroundColor: statusColor,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.percentageText, { color: statusColor }]}>
                    {percentage.toFixed(0)}%
                  </Text>
                </View>
              </View>
            );
          })
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo Presupuesto</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Categoría</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Comida"
              value={newCategory}
              onChangeText={setNewCategory}
            />
            <Text style={styles.label}>Límite ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="numeric"
              value={newLimit}
              onChangeText={setNewLimit}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveBudget}
            >
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
  content: { flex: 1, paddingHorizontal: 20 },
  titleSection: {
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleText: { fontSize: 28, fontWeight: "700", color: "#1F2937" },
  subtitleText: { fontSize: 14, color: "#6B7280", marginTop: 8 },
  newBudgetButton: {
    backgroundColor: "#475569",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  newBudgetText: { color: "white", fontSize: 14, fontWeight: "600" },
  periodCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  periodLabel: { fontSize: 16, fontWeight: "600", color: "#1F2937" },
  budgetCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  budgetLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryEmoji: { fontSize: 24 },
  budgetInfo: { flex: 1 },
  categoryName: { fontSize: 17, fontWeight: "600", color: "#1F2937" },
  budgetSubtext: { fontSize: 13, color: "#6B7280" },
  budgetProgressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  budgetProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 4,
    marginRight: 12,
    overflow: "hidden",
  },
  budgetProgress: { height: "100%", borderRadius: 4 },
  percentageText: { fontSize: 14, fontWeight: "600", textAlign: "right" },
  emptyStateCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    shadowOpacity: 0.05,
    elevation: 2,
  },
  emptyStateText: { fontSize: 15, color: "#6B7280", textAlign: "center" },
  bottomSpacer: { height: 80 },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold" },
  label: { fontSize: 14, color: "#666", marginBottom: 5, marginTop: 10 },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#0D7A43",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: { color: "white", fontWeight: "bold" },
});

export default PresupuestosMensuales;
