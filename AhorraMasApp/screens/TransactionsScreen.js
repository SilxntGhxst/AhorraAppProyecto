import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Image,
  Modal,
  Alert,
} from "react-native";
import {
  Edit2,
  Trash2,
  TrendingUp,
  TrendingDown,
  X,
  Plus,
  SlidersHorizontal,
  Search,
} from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from "../services/DBService";

const TransactionsScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Formulario
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newType, setNewType] = useState("expense");

  const loadData = async () => {
    try {
      const userId = await SecureStore.getItemAsync("user_id");
      if (userId) {
        const data = await getTransactions(userId);
        setTransactions(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const openModalForCreate = () => {
    setEditingId(null);
    setNewTitle("");
    setNewAmount("");
    setNewCategory("");
    setNewType("expense");
    setModalVisible(true);
  };

  const openModalForEdit = (item) => {
    setEditingId(item.id);
    setNewTitle(item.titulo);
    setNewAmount(Math.abs(item.monto).toString());
    setNewCategory(item.categoria);
    setNewType(item.tipo || "expense");
    setModalVisible(true);
  };

  const handleSaveTransaction = async () => {
    if (!newTitle || !newAmount || !newCategory) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    try {
      const userId = await SecureStore.getItemAsync("user_id");
      const fecha = new Date().toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const montoFinal =
        parseFloat(newAmount) * (newType === "expense" ? -1 : 1);

      if (editingId) {
        await updateTransaction(
          editingId,
          newTitle,
          newCategory,
          fecha,
          montoFinal,
          newType
        );
        Alert.alert("Actualizado", "Transacción modificada correctamente");
      } else {
        await addTransaction(
          userId,
          newTitle,
          newCategory,
          fecha,
          montoFinal,
          newType
        );
        Alert.alert("Guardado", "Transacción creada correctamente");
      }

      setModalVisible(false);
      loadData();
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar");
    }
  };

  const handleDelete = (id) => {
    Alert.alert("Eliminar", "¿Borrar esta transacción?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await deleteTransaction(id);
          loadData();
        },
      },
    ]);
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

      <View style={styles.titleSection}>
        <View style={styles.titleRow}>
          <View style={styles.titleIcon}>
            <Text style={styles.titleEmoji}>📄</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.titleText}>Transacciones</Text>
            <Text style={styles.subtitleText}>
              {transactions.length} movimientos
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={openModalForCreate}
          >
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filtros visuales (se mantienen igual) */}
      <View style={styles.filtersContainer}>
        <View style={styles.filtersCard}>
          <View style={styles.filtersHeader}>
            <Text style={styles.filtersTitle}>Filtros</Text>
            <TouchableOpacity style={styles.filterButton}>
              <SlidersHorizontal size={16} color="#6B7280" />
              <Text style={styles.filterButtonText}>Filtros</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar transacciones..."
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.transactionsList}
        showsVerticalScrollIndicator={false}
      >
        {transactions.map((transaction) => {
          const isIncome =
            transaction.tipo === "income" || transaction.monto > 0;
          const IconComponent = isIncome ? TrendingUp : TrendingDown;
          const color = isIncome ? "#10B981" : "#EF4444";

          return (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionContent}>
                <View style={styles.transactionLeft}>
                  <Text style={styles.transactionTitle}>
                    {transaction.titulo}
                  </Text>
                  <View style={styles.transactionDetails}>
                    <IconComponent size={16} color={color} />
                    <View
                      style={[styles.categoryDot, { backgroundColor: color }]}
                    />
                    <Text style={styles.categoryText}>
                      {transaction.categoria}
                    </Text>
                    <Text style={styles.separator}>·</Text>
                    <Text style={styles.dateText}>{transaction.fecha}</Text>
                  </View>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={[styles.amountText, { color: color }]}>
                    {isIncome ? "+" : ""} $
                    {Math.abs(transaction.monto).toFixed(2)}
                  </Text>
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => openModalForEdit(transaction)}
                    >
                      <Edit2 size={20} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDelete(transaction.id)}
                    >
                      <Trash2 size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
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
              <Text style={styles.modalTitle}>
                {editingId ? "Editar Transacción" : "Nueva Transacción"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Título</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Salario"
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <Text style={styles.label}>Monto</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="numeric"
              value={newAmount}
              onChangeText={setNewAmount}
            />

            <Text style={styles.label}>Categoría</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Transporte"
              value={newCategory}
              onChangeText={setNewCategory}
            />

            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newType === "expense" && styles.typeButtonActiveExpense,
                ]}
                onPress={() => setNewType("expense")}
              >
                <Text
                  style={[
                    styles.typeText,
                    newType === "expense" && styles.typeTextActive,
                  ]}
                >
                  Gasto
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newType === "income" && styles.typeButtonActiveIncome,
                ]}
                onPress={() => setNewType("income")}
              >
                <Text
                  style={[
                    styles.typeText,
                    newType === "income" && styles.typeTextActive,
                  ]}
                >
                  Ingreso
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveTransaction}
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
  titleSection: {
    backgroundColor: "#E8F3EC",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  titleRow: { flexDirection: "row", alignItems: "center" },
  titleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  titleEmoji: { fontSize: 24 },
  titleText: { fontSize: 20, fontWeight: "600", color: "#1F2937" },
  subtitleText: { fontSize: 14, color: "#6B7280" },
  filtersContainer: { paddingHorizontal: 20, marginTop: 10 },
  filtersCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  filtersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  filtersTitle: { fontSize: 16, fontWeight: "500" },
  filterButton: {
    flexDirection: "row",
    padding: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
  },
  filterButtonText: { fontSize: 14, color: "#6B7280", marginLeft: 6 },
  searchBar: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, marginLeft: 8 },
  transactionsList: { flex: 1, paddingHorizontal: 20, marginTop: 15 },
  transactionCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  transactionContent: { flexDirection: "row", justifyContent: "space-between" },
  transactionLeft: { flex: 1 },
  transactionTitle: { fontSize: 17, fontWeight: "600", marginBottom: 8 },
  transactionDetails: { flexDirection: "row", alignItems: "center" },
  categoryDot: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 6 },
  categoryText: { fontSize: 13, color: "#6B7280" },
  dateText: { fontSize: 13, color: "#6B7280" },
  separator: { marginHorizontal: 6, color: "#9CA3AF" },
  transactionRight: { alignItems: "flex-end" },
  amountText: { fontSize: 17, fontWeight: "600", marginBottom: 8 },
  actions: { flexDirection: "row" },
  actionButton: { marginLeft: 10 },
  bottomSpacer: { height: 80 },

  // Nuevos estilos
  addButton: {
    backgroundColor: "#0D7A43",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    minHeight: 450,
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
  typeSelector: { flexDirection: "row", marginVertical: 20, gap: 10 },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  typeButtonActiveExpense: {
    backgroundColor: "#FEE2E2",
    borderColor: "#EF4444",
  },
  typeButtonActiveIncome: {
    backgroundColor: "#D1FAE5",
    borderColor: "#10B981",
  },
  typeText: { fontWeight: "600", color: "#6B7280" },
  typeTextActive: { color: "#1F2937" },
  saveButton: {
    backgroundColor: "#0D7A43",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});

export default TransactionsScreen;
