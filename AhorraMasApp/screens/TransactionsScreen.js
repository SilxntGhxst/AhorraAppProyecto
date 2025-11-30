import React, { useState, useCallback, useEffect } from "react";
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, StatusBar, StyleSheet, Modal, Alert, Platform, Image
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { Search, SlidersHorizontal, Edit2, Trash2, TrendingUp, TrendingDown, X, Plus, Check, Calendar, ChevronDown, List } from "lucide-react-native";
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import DateTimePicker from '@react-native-community/datetimepicker'; 

import { TransaccionController } from '../controllers/TransaccionController';

const TransactionsScreen = ({ navigation }) => {
  
  const [userName, setUserName] = useState('Usuario');
  
  const [allTransactions, setAllTransactions] = useState([]);
  const [displayedTransactions, setDisplayedTransactions] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]); 
  const [searchText, setSearchText] = useState('');
  
  // Filtros
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Formulario
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newDate, setNewDate] = useState(''); 
  const [newType, setNewType] = useState('expense');
  const [isManualCategory, setIsManualCategory] = useState(false);

  // Pickers
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState('form'); 
  const [pickerDate, setPickerDate] = useState(new Date());

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryPickerMode, setCategoryPickerMode] = useState('form'); 
  
  const transactionController = new TransaccionController();

  const getUserId = async () => {
    let userId = await SecureStore.getItemAsync('user_id');
    if (!userId) userId = '1';
    return userId;
  };

  const loadData = async () => {
   try {
      const userId = await getUserId();
      
      const storedName = await SecureStore.getItemAsync('user_name');
      if (storedName) setUserName(storedName.split(' ')[0]); // Tomar solo el primer nombre
      // --------------------------------------------------

      const data = await transactionController.obtenerTodas(userId);
      setAllTransactions(data);
      
      const cats = [...new Set(data.map(t => t.categoria).filter(c => c && c.trim() !== ''))].sort();
      setAvailableCategories(cats);

      applyFilters(data, searchText, filterType, filterCategory, filterDate); 
    } catch (error) { 
      console.error(error);
     }
  };

  useFocusEffect(useCallback(() => { loadData(); }, []));

  // --- LÓGICA DE FECHAS ---
  const formatDateToSpanish = (date) => {
    return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const openDatePicker = (mode) => {
    setDatePickerMode(mode);
    setPickerDate(new Date()); 
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || pickerDate;
    if (Platform.OS === 'android') setShowDatePicker(false);
    
    if (event.type === 'set' || Platform.OS === 'ios') {
      const dateString = formatDateToSpanish(currentDate);
      if (datePickerMode === 'form') {
        setNewDate(dateString);
      } else {
        setFilterDate(dateString);
      }
      setPickerDate(currentDate);
    }
  };

  // --- LÓGICA DE CATEGORÍAS ---
  const openCategoryPicker = (mode) => {
    setCategoryPickerMode(mode);
    setShowCategoryModal(true);
  };

  const selectCategory = (cat) => {
    if (categoryPickerMode === 'form') {
      setNewCategory(cat);
      setIsManualCategory(false);
    } else {
      setFilterCategory(cat);
    }
    setShowCategoryModal(false);
  };

  // --- FILTROS ---
  const applyFilters = (data, search, type, categoryFilter, dateFilter) => {
    let result = data || [];

    if (type !== 'all') result = result.filter(t => t.tipo === type);

    if (search.trim() !== '') {
      const term = search.toLowerCase();
      result = result.filter(t => (t.titulo && t.titulo.toLowerCase().includes(term)));
    }

    if (categoryFilter.trim() !== '') {
      const catTerm = categoryFilter.toLowerCase();
      result = result.filter(t => t.categoria && t.categoria.toLowerCase() === catTerm);
    }

    if (dateFilter.trim() !== '') {
      const dateTerm = dateFilter.toLowerCase();
      result = result.filter(t => t.fecha && t.fecha.toLowerCase().includes(dateTerm));
    }

    setDisplayedTransactions(result);
  };

  useEffect(() => { 
    applyFilters(allTransactions, searchText, filterType, filterCategory, filterDate); 
  }, [searchText, filterType, filterCategory, filterDate, allTransactions]);

  // --- CRUD ---
  const handleSaveTransaction = async () => {
    if (!newTitle.trim() || !newAmount.trim() || !newCategory.trim() || !newDate.trim()) { 
        Alert.alert("Error", "Completa todos los campos."); 
        return; 
    }
    try {
      const userId = await getUserId();
      const montoNum = parseFloat(newAmount);
      if (isNaN(montoNum)) { Alert.alert("Error", "Monto inválido"); return; }
      const montoFinal = Math.abs(montoNum) * (newType === 'expense' ? -1 : 1);

      if (editingId) 
        await transactionController.actualizar(editingId, newTitle, newCategory, newDate, montoFinal, newType);
      else 
        await transactionController.agregar(userId, newTitle, newCategory, newDate, montoFinal, newType);
      
      setModalVisible(false);
      resetForm();
      setTimeout(() => loadData(), 100);
    } catch (error) { Alert.alert("Error", "No se pudo guardar"); }
  };

  const handleDelete = (id) => {
    Alert.alert("Eliminar", "¿Borrar transacción?", [
        { text: "Cancelar", style: "cancel" }, 
        { text: "Eliminar", style: "destructive", onPress: async () => { await transactionController.eliminar(id); loadData(); } }
    ]);
  };

  const openModalForEdit = (t) => {
    setNewTitle(t.titulo); 
    setNewAmount(Math.abs(t.monto).toString()); 
    setNewCategory(t.categoria); 
    setNewDate(t.fecha);
    setNewType(t.tipo || 'expense');
    setEditingId(t.id);
    setIsManualCategory(false); 
    setModalVisible(true);
  };

  const resetForm = () => { 
      setNewTitle(''); setNewAmount(''); setNewCategory(''); 
      setNewDate(formatDateToSpanish(new Date()));
      setNewType('expense'); setEditingId(null); setIsManualCategory(false);
  };

  const clearFilters = () => {
      setFilterType('all'); setFilterCategory(''); setFilterDate(''); setSearchText('');
      setShowFilterModal(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
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

      {/* Barra de Filtros */}
      <View style={styles.filtersContainer}>
        <View style={styles.filtersCard}>
          <View style={styles.filtersHeader}>
            <Text style={styles.filtersTitle}>Filtros</Text>
            <TouchableOpacity 
                style={[styles.filterButton, (filterType !== 'all' || filterCategory !== '' || filterDate !== '') && styles.filterButtonActive]} 
                onPress={() => setShowFilterModal(true)}
            >
              <SlidersHorizontal size={16} color={(filterType !== 'all' || filterCategory !== '' || filterDate !== '') ? "#0D7A43" : "#6B7280"} />
              <Text style={[styles.filterButtonText, (filterType !== 'all' || filterCategory !== '' || filterDate !== '') && styles.filterButtonTextActive]}>
                Configurar
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" />
            <TextInput style={styles.searchInput} placeholder="Buscar por título..." placeholderTextColor="#9CA3AF" value={searchText} onChangeText={setSearchText} />
            {searchText !== '' && <TouchableOpacity onPress={() => setSearchText('')}><X size={16} color="#9CA3AF" /></TouchableOpacity>}
          </View>
        </View>
      </View>

      {/* Lista */}
      <ScrollView style={styles.transactionsList} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {displayedTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No hay coincidencias con los filtros.</Text>
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

      {/* ---- MODALES ---- */}

      {/* 1. Modal DATE PICKER */}
      {showDatePicker && (
        <DateTimePicker
          value={pickerDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* 2. Modal CATEGORY PICKER */}
      <Modal visible={showCategoryModal} transparent animationType="fade" onRequestClose={() => setShowCategoryModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCategoryModal(false)}>
          <View style={styles.categoryModalContent}>
            <Text style={styles.modalTitle}>Selecciona una Categoría</Text>
            <ScrollView style={{maxHeight: 300}}>
              {availableCategories.map((cat, index) => (
                <TouchableOpacity key={index} style={styles.categoryOption} onPress={() => selectCategory(cat)}>
                  <Text style={styles.categoryOptionText}>{cat}</Text>
                  {(categoryPickerMode === 'form' ? newCategory : filterCategory) === cat && <Check size={18} color="#0D7A43"/>}
                </TouchableOpacity>
              ))}
              {availableCategories.length === 0 && <Text style={{textAlign:'center', color:'#999', margin:10}}>No hay categorías guardadas aún.</Text>}
            </ScrollView>
            
            {categoryPickerMode === 'form' && (
              <TouchableOpacity style={styles.newCategoryButton} onPress={() => { setIsManualCategory(true); setShowCategoryModal(false); setNewCategory(''); }}>
                <Plus size={18} color="white" />
                <Text style={styles.newCategoryButtonText}>Nueva Categoría</Text>
              </TouchableOpacity>
            )}
            
            {categoryPickerMode === 'filter' && (
               <TouchableOpacity style={[styles.newCategoryButton, {backgroundColor:'#EF4444', marginTop:10}]} onPress={() => { setFilterCategory(''); setShowCategoryModal(false); }}>
                 <X size={18} color="white" />
                 <Text style={styles.newCategoryButtonText}>Quitar Filtro</Text>
               </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 3. Modal FORMULARIO */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? "Editar" : "Nuevo"} Movimiento</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}><X size={24} color="#333" /></TouchableOpacity>
            </View>
            
            <View style={styles.inputGroup}><Text style={styles.label}>Título</Text><TextInput style={styles.input} placeholder="Ej. Salario" value={newTitle} onChangeText={setNewTitle} /></View>
            <View style={styles.inputGroup}><Text style={styles.label}>Monto</Text><TextInput style={styles.input} placeholder="0.00" keyboardType="numeric" value={newAmount} onChangeText={setNewAmount} /></View>
            
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Categoría</Text>
                {isManualCategory ? (
                  <View style={{flexDirection:'row', gap:5}}>
                    <TextInput style={[styles.input, {flex:1}]} placeholder="Escribe nueva categoría..." value={newCategory} onChangeText={setNewCategory} autoFocus />
                    <TouchableOpacity style={styles.iconButton} onPress={() => setIsManualCategory(false)}><List size={20} color="#666"/></TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.dropdownButton} onPress={() => openCategoryPicker('form')}>
                    <Text style={{fontSize:16, color: newCategory ? '#1F2937' : '#9CA3AF'}}>{newCategory || "Seleccionar..."}</Text>
                    <ChevronDown size={20} color="#6B7280" />
                  </TouchableOpacity>
                )}
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Fecha</Text>
                <TouchableOpacity style={styles.dropdownButton} onPress={() => openDatePicker('form')}>
                  <Text style={{fontSize:16, color: '#1F2937'}}>{newDate}</Text>
                  <Calendar size={20} color="#6B7280" />
                </TouchableOpacity>
            </View>

            <View style={styles.typeSelector}>
              <TouchableOpacity style={[styles.typeButton, newType === 'expense' && styles.typeButtonActiveExpense]} onPress={() => setNewType('expense')}>
                  <Text style={[styles.typeText, newType === 'expense' && styles.typeTextActive]}>Gasto</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.typeButton, newType === 'income' && styles.typeButtonActiveIncome]} onPress={() => setNewType('income')}>
                  <Text style={[styles.typeText, newType === 'income' && styles.typeTextActive]}>Ingreso</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveTransaction}>
                <Text style={styles.saveButtonText}>{editingId ? "Actualizar" : "Guardar"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 4. Modal FILTROS */}
      <Modal animationType="fade" transparent={true} visible={showFilterModal} onRequestClose={() => setShowFilterModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowFilterModal(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.filterModalContent}>
            <Text style={styles.filterModalTitle}>Filtros Avanzados</Text>
            
            <Text style={styles.filterSectionTitle}>Tipo</Text>
            <View style={styles.typeSelector}>
                {['all', 'income', 'expense'].map((type) => (
                <TouchableOpacity key={type} style={[styles.filterTypeOption, filterType === type && styles.filterTypeOptionSelected]} onPress={() => setFilterType(type)}>
                    <Text style={[styles.filterTypeText, filterType === type && styles.filterTypeTextSelected]}>
                        {type === 'all' ? 'Todos' : type === 'income' ? 'Ingresos' : 'Gastos'}
                    </Text>
                </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.filterSectionTitle}>Categoría</Text>
            <TouchableOpacity style={styles.filterInputDropdown} onPress={() => openCategoryPicker('filter')}>
               <Text style={{color: filterCategory ? '#333' : '#999'}}>{filterCategory || "Todas las categorías"}</Text>
               <ChevronDown size={18} color="#999"/>
            </TouchableOpacity>

            <Text style={styles.filterSectionTitle}>Fecha</Text>
            <TouchableOpacity style={styles.filterInputDropdown} onPress={() => openDatePicker('filter')}>
               <Text style={{color: filterDate ? '#333' : '#999'}}>{filterDate || "Cualquier fecha"}</Text>
               <Calendar size={18} color="#999"/>
            </TouchableOpacity>
            {filterDate !== '' && (
              <TouchableOpacity onPress={() => setFilterDate('')}>
                <Text style={{color:'#EF4444', fontSize:12, marginTop:5, textAlign:'right'}}>Borrar fecha</Text>
              </TouchableOpacity>
            )}

            <View style={styles.filterActions}>
                <TouchableOpacity style={styles.clearFilterButton} onPress={clearFilters}>
                    <Text style={styles.clearFilterText}>Limpiar Todo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyFilterButton} onPress={() => setShowFilterModal(false)}>
                    <Text style={styles.applyFilterText}>Aplicar</Text>
                </TouchableOpacity>
            </View>

          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F3EC" },
  header: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E0E0E0', elevation: 2 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { width: 40, height: 40, marginRight: 12 },
  greeting: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  subGreeting: { fontSize: 13, color: '#0D7A43', fontWeight: '600' },
  profileButton: { padding: 4 },

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
  
  addButton: { backgroundColor: '#0D7A43', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 20, padding: 20, elevation: 5 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, color: '#6B7280', marginBottom: 5 },
  input: { backgroundColor: '#F3F4F6', borderRadius: 8, padding: 12, fontSize: 16, color: '#1F2937' },
  dropdownButton: { backgroundColor: '#F3F4F6', borderRadius: 8, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconButton: { backgroundColor: '#E5E7EB', padding: 12, borderRadius: 8, justifyContent:'center', alignItems:'center' },

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

  // Category Modal Styles
  categoryModalContent: { backgroundColor: 'white', borderRadius: 12, padding: 20, marginHorizontal: 20, alignSelf: 'center', width: '85%', maxHeight: '60%' },
  categoryOption: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  categoryOptionText: { fontSize: 16, color: '#333' },
  newCategoryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0D7A43', padding: 12, borderRadius: 8, marginTop: 15 },
  newCategoryButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 8 },

  // Filter Modal Styles
  filterModalContent: { backgroundColor: 'white', borderRadius: 12, padding: 20, marginHorizontal: 20, alignSelf: 'center', width: '90%' },
  filterModalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  filterSectionTitle: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 10, marginTop: 10 },
  filterTypeOption: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', marginRight: 10, marginBottom: 5 },
  filterTypeOptionSelected: { backgroundColor: '#D1FAE5', borderColor: '#10B981' },
  filterTypeText: { fontSize: 14, color: '#6B7280' },
  filterTypeTextSelected: { color: '#0D7A43', fontWeight: '600' },
  filterInputDropdown: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 12, flexDirection: 'row', justifyContent:'space-between', alignItems:'center' },
  filterActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
  clearFilterButton: { padding: 10 },
  clearFilterText: { color: '#6B7280', fontSize: 15 },
  applyFilterButton: { backgroundColor: '#0D7A43', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  applyFilterText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
});

export default TransactionsScreen;