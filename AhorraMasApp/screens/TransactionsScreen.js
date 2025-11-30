import React, { useState, useCallback, useEffect } from "react";
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, StatusBar, StyleSheet, Image, Modal, Alert, Platform
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context'; // Usar SafeAreaView consistente
import { Search, SlidersHorizontal, Edit2, Trash2, TrendingUp, TrendingDown, X, Plus, Check } from "lucide-react-native";
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { TransaccionController } from '../controllers/TransaccionController';

const TransactionsScreen = ({ navigation }) => { // Añadir navigation prop
  
  const [userName, setUserName] = useState('Usuario'); // Estado para nombre
  
  const [allTransactions, setAllTransactions] = useState([]);
  const [displayedTransactions, setDisplayedTransactions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newType, setNewType] = useState('expense');
  const transactionController = new TransaccionController();

  const getUserId = async () => {
    let userId = await SecureStore.getItemAsync('user_id');
    if (!userId) userId = '1';
    return userId;
  };

  const loadData = async () => {
   try {
      const userId = await getUserId();
      const data = await transactionController.obtenerTodas(userId); // <--- USO DEL CONTROLADOR
      setAllTransactions(data);
      applyFilters(data, searchText, filterType); 
    } catch (error) { 
      console.error(error);
     }
  };

  useFocusEffect(useCallback(() => { loadData(); }, []));

  const applyFilters = (data, search, type) => {
    let result = data || [];
    if (type !== 'all') result = result.filter(t => t.tipo === type);
    if (search.trim() !== '') {
      const term = search.toLowerCase();
      result = result.filter(t => 
        (t.titulo && t.titulo.toLowerCase().includes(term)) || 
        (t.categoria && t.categoria.toLowerCase().includes(term))
      );
    }
    setDisplayedTransactions(result);
  };

  useEffect(() => { applyFilters(allTransactions, searchText, filterType); }, [searchText, filterType, allTransactions]);

  const handleSaveTransaction = async () => {
    if (!newTitle.trim() || !newAmount.trim() || !newCategory.trim()) { Alert.alert("Error", "Completa los campos"); return; }
    try {
      const userId = await getUserId();
      const fecha = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
      const montoNum = parseFloat(newAmount);
      if (isNaN(montoNum)) { Alert.alert("Error", "Monto inválido"); return; }
      const montoFinal = Math.abs(montoNum) * (newType === 'expense' ? -1 : 1);

      if (editingId) 
        await transactionController.actualizar(editingId, newTitle, newCategory, fecha, montoFinal, newType);
      else await transactionController.agregar(userId, newTitle, newCategory, fecha, montoFinal, newType);
      
      setModalVisible(false);
      resetForm();
      setTimeout(() => loadData(), 100);
    } catch (error) { Alert.alert("Error", "No se pudo guardar"); }
  };

  const handleDelete = (id) => {
    Alert.alert("Eliminar", "¿Borrar transacción?", [{ text: "Cancelar", style: "cancel" }, { text: "Eliminar", style: "destructive", onPress: async () => { await transactionController.eliminar(id); loadData(); } }]);
  };

  const openModalForEdit = (t) => {
    setNewTitle(t.titulo); setNewAmount(Math.abs(t.monto).toString()); setNewCategory(t.categoria); setNewType(t.tipo || 'expense');
    setEditingId(t.id); setModalVisible(true);
  };

  const resetForm = () => { setNewTitle(''); setNewAmount(''); setNewCategory(''); setNewType('expense'); setEditingId(null); };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* HEADER CONSISTENTE */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>     
          <Image source={require('../assets/Puerquito2.jpg')} style={styles.logoIcon} />
          <View>
            <Text style={styles.greeting}>Hola, {userName}</Text>
            <Text style={styles.subGreeting}>Transacciones</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Perfil')} style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={34} color="#0D7A43" />
        </TouchableOpacity>
      </View>

      <View style={styles.titleSection}>
        <View style={styles.titleRow}>
          <View style={styles.titleIcon}><Text style={styles.titleEmoji}>📄</Text></View>
          <View style={{flex: 1}}>
            <Text style={styles.titleText}>Movimientos</Text>
            <Text style={styles.subtitleText}>{displayedTransactions.length} encontrados</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => { resetForm(); setModalVisible(true); }}>
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.filtersCard}>
          <View style={styles.filtersHeader}>
            <Text style={styles.filtersTitle}>Filtros</Text>
            <TouchableOpacity style={[styles.filterButton, filterType !== 'all' && styles.filterButtonActive]} onPress={() => setShowFilterModal(true)}>
              <SlidersHorizontal size={16} color={filterType !== 'all' ? "#0D7A43" : "#6B7280"} />
              <Text style={[styles.filterButtonText, filterType !== 'all' && styles.filterButtonTextActive]}>
                {filterType === 'all' ? 'Todos' : filterType === 'income' ? 'Ingresos' : 'Gastos'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" />
            <TextInput style={styles.searchInput} placeholder="Buscar..." placeholderTextColor="#9CA3AF" value={searchText} onChangeText={setSearchText} />
            {searchText !== '' && <TouchableOpacity onPress={() => setSearchText('')}><X size={16} color="#9CA3AF" /></TouchableOpacity>}
          </View>
        </View>
      </View>

      <ScrollView style={styles.transactionsList} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {displayedTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{searchText ? "No hay coincidencias." : "No hay transacciones aún."}</Text>
          </View>
        ) : (
          displayedTransactions.map((transaction, index) => {
            const isIncome = transaction.tipo === "income" || transaction.monto > 0;
            const IconComponent = isIncome ? TrendingUp : TrendingDown;
            const color = isIncome ? "#10B981" : "#EF4444";
            return (
              <View key={transaction.id || index} style={styles.transactionCard}>
                <View style={styles.transactionContent}>
                  <View style={styles.transactionLeft}>
                    <Text style={styles.transactionTitle}>{transaction.titulo || "Sin título"}</Text>
                    <View style={styles.transactionDetails}>
                      <IconComponent size={16} color={color} />
                      <View style={[styles.categoryDot, { backgroundColor: color }]} />
                      <Text style={styles.categoryText}>{transaction.categoria || "General"}</Text>
                      <Text style={styles.separator}>·</Text>
                      <Text style={styles.dateText}>{transaction.fecha}</Text>
                    </View>
                  </View>
                  <View style={styles.transactionRight}>
                    <Text style={[styles.amountText, { color: color }]}>{isIncome ? "+" : ""} ${Math.abs(transaction.monto).toLocaleString("es-MX", { minimumFractionDigits: 2 })}</Text>
                    <View style={styles.actions}>
                      <TouchableOpacity style={styles.actionButton} onPress={() => openModalForEdit(transaction)}><Edit2 size={20} color="#6B7280" /></TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(transaction.id)}><Trash2 size={20} color="#EF4444" /></TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? "Editar Transacción" : "Nueva Transacción"}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}><X size={24} color="#333" /></TouchableOpacity>
            </View>
            <View style={styles.inputGroup}><Text style={styles.label}>Título</Text><TextInput style={styles.input} placeholder="Ej. Salario" value={newTitle} onChangeText={setNewTitle} /></View>
            <View style={styles.inputGroup}><Text style={styles.label}>Monto</Text><TextInput style={styles.input} placeholder="0.00" keyboardType="numeric" value={newAmount} onChangeText={setNewAmount} /></View>
            <View style={styles.inputGroup}><Text style={styles.label}>Categoría</Text><TextInput style={styles.input} placeholder="Ej. Transporte" value={newCategory} onChangeText={setNewCategory} /></View>
            <View style={styles.typeSelector}>
              <TouchableOpacity style={[styles.typeButton, newType === 'expense' && styles.typeButtonActiveExpense]} onPress={() => setNewType('expense')}><Text style={[styles.typeText, newType === 'expense' && styles.typeTextActive]}>Gasto</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.typeButton, newType === 'income' && styles.typeButtonActiveIncome]} onPress={() => setNewType('income')}><Text style={[styles.typeText, newType === 'income' && styles.typeTextActive]}>Ingreso</Text></TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveTransaction}><Text style={styles.saveButtonText}>{editingId ? "Actualizar" : "Guardar"}</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent={true} visible={showFilterModal} onRequestClose={() => setShowFilterModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowFilterModal(false)}>
          <View style={styles.filterModalContent}>
            <Text style={styles.filterModalTitle}>Filtrar por Tipo</Text>
            {['all', 'income', 'expense'].map((type) => (
              <TouchableOpacity key={type} style={[styles.filterOption, filterType === type && styles.filterOptionSelected]} onPress={() => { setFilterType(type); setShowFilterModal(false); }}>
                <Text style={[styles.filterOptionText, filterType === type && styles.filterOptionTextSelected]}>{type === 'all' ? 'Todos' : type === 'income' ? 'Ingresos' : 'Gastos'}</Text>
                {filterType === type && <Check size={20} color="#0D7A43" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F3EC" },
  // ESTILOS DE HEADER COMPARTIDOS
  header: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E0E0E0', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { width: 40, height: 40, marginRight: 12 },
  greeting: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  subGreeting: { fontSize: 13, color: '#0D7A43', fontWeight: '600' },
  profileButton: { padding: 4 },

  // RESTO DE ESTILOS
  titleSection: { backgroundColor: "#E8F3EC", paddingHorizontal: 20, paddingVertical: 15 },
  titleRow: { flexDirection: "row", alignItems: "center" },
  titleIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: "white", justifyContent: "center", alignItems: 'center', marginRight: 12 },
  titleEmoji: { fontSize: 24 },
  titleText: { fontSize: 20, fontWeight: "600", color: "#1F2937" },
  subtitleText: { fontSize: 14, color: "#6B7280" },
  filtersContainer: { paddingHorizontal: 20, marginTop: 10 },
  filtersCard: { backgroundColor: "white", borderRadius: 12, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  filtersHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  filtersTitle: { fontSize: 16, fontWeight: "500", color: "#1F2937" },
  filterButton: { flexDirection: "row", alignItems: "center", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, borderWidth: 1, borderColor: "#E5E7EB" },
  filterButtonActive: { borderColor: "#0D7A43", backgroundColor: "#E8F3EC" },
  filterButtonText: { fontSize: 14, color: "#6B7280", marginLeft: 6 },
  filterButtonTextActive: { color: "#0D7A43", fontWeight: "600" },
  searchBar: { backgroundColor: "#F3F4F6", borderRadius: 8, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 10 },
  searchInput: { flex: 1, color: "#1F2937", fontSize: 15, marginLeft: 8, paddingVertical: 0 },
  transactionsList: { flex: 1, paddingHorizontal: 20, marginTop: 15 },
  transactionCard: { backgroundColor: "white", borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  transactionContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  transactionLeft: { flex: 1 },
  transactionTitle: { fontSize: 17, fontWeight: "600", color: "#1F2937", marginBottom: 8 },
  transactionDetails: { flexDirection: "row", alignItems: "center" },
  categoryDot: { width: 6, height: 6, borderRadius: 3, marginLeft: 6, marginRight: 8 },
  categoryText: { fontSize: 13, color: "#6B7280" },
  separator: { fontSize: 13, color: "#9CA3AF", marginHorizontal: 6 },
  dateText: { fontSize: 13, color: "#6B7280" },
  transactionRight: { alignItems: "flex-end" },
  amountText: { fontSize: 17, fontWeight: "600", marginBottom: 8 },
  actions: { flexDirection: "row", alignItems: "center" },
  actionButton: { marginLeft: 15 },
  bottomSpacer: { height: 80 },
  
  addButton: { backgroundColor: '#0D7A43', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 20, padding: 20, elevation: 5 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, color: '#6B7280', marginBottom: 5 },
  input: { backgroundColor: '#F3F4F6', borderRadius: 8, padding: 12, fontSize: 16, color: '#1F2937' },
  typeSelector: { flexDirection: 'row', marginBottom: 20, gap: 10 },
  typeButton: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  typeButtonActiveExpense: { backgroundColor: '#FEE2E2', borderColor: '#EF4444' },
  typeButtonActiveIncome: { backgroundColor: '#D1FAE5', borderColor: '#10B981' },
  typeText: { fontWeight: '600', color: '#6B7280' },
  typeTextActive: { color: '#1F2937' },
  saveButton: { backgroundColor: '#0D7A43', padding: 16, borderRadius: 10, alignItems: 'center' },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  emptyState: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#9CA3AF', fontSize: 16 },
  filterModalContent: { backgroundColor: 'white', borderRadius: 12, padding: 20, marginHorizontal: 40, alignSelf: 'center', width: '80%' },
  filterModalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  filterOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  filterOptionSelected: { backgroundColor: '#F0FDF4' },
  filterOptionText: { fontSize: 16, color: '#374151' },
  filterOptionTextSelected: { color: '#0D7A43', fontWeight: '600' },
});

export default TransactionsScreen;