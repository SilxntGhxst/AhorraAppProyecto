import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, ScrollView, Image, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2, X, Search, AlertTriangle, Filter } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { PresupuestoController } from '../controllers/PresupuestoController';

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

export default function PresupuestosMensuales({ navigation }) {
  const presupuestoController = new PresupuestoController();
  const [userName, setUserName] = useState('Usuario');
  
  const now = new Date();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  
  const [allBudgets, setAllBudgets] = useState([]); 
  const [displayedBudgets, setDisplayedBudgets] = useState([]);
  
  // --- FILTROS ---
  const [searchText, setSearchText] = useState(''); 
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'exceeded', 'ok'

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');

  const getMonthName = (index) => months[index];

  const loadData = async () => {
    try {
      const userId = await SecureStore.getItemAsync('user_id');
      const storedName = await SecureStore.getItemAsync('user_name');
      if (storedName) setUserName(storedName.split(' ')[0]);

      if (userId) {
        const mesNombre = getMonthName(currentMonthIndex);
        const anioStr = currentYear.toString();
        const data = await presupuestoController.obtenerConGasto(userId, mesNombre, anioStr);
        setAllBudgets(data);
        // Aplicamos filtros iniciales
        applyFilters(data, searchText, filterStatus);
      }
    } catch (error) { console.error(error); }
  };

  useFocusEffect(useCallback(() => { loadData(); }, [currentMonthIndex, currentYear]));

  // Lógica de Filtrado Combinado (Texto + Estado)
  const applyFilters = (data, text, status) => {
    let result = data;

    // 1. Filtro por Texto (Categoría)
    if (text.trim() !== '') {
      const term = text.toLowerCase();
      result = result.filter(b => b.categoria.toLowerCase().includes(term));
    }

    // 2. Filtro por Estado (Excedido / En Orden)
    if (status !== 'all') {
      result = result.filter(b => {
        const isExceeded = (b.monto_gastado || 0) >= b.monto_limite;
        return status === 'exceeded' ? isExceeded : !isExceeded;
      });
    }

    setDisplayedBudgets(result);
  };

  // Listeners de cambios en filtros
  useEffect(() => {
    applyFilters(allBudgets, searchText, filterStatus);
  }, [searchText, filterStatus, allBudgets]);

  const changeMonth = (inc) => {
    let newIndex = currentMonthIndex + inc;
    let newYear = currentYear;
    if (newIndex > 11) { newIndex = 0; newYear++; } else if (newIndex < 0) { newIndex = 11; newYear--; }
    setCurrentMonthIndex(newIndex); setCurrentYear(newYear);
  };

  const handleSave = async () => {
    if (!category.trim() || !limit.trim()) {
      Alert.alert("Error", "Completa los campos");
      return;
    }
    try {
      const userId = await SecureStore.getItemAsync('user_id');
      const mesNombre = getMonthName(currentMonthIndex);
      const anioStr = currentYear.toString();

      if (editingId) {
        await presupuestoController.actualizar(editingId, category, parseFloat(limit));
      } else {
        await presupuestoController.agregar(userId, category, parseFloat(limit), mesNombre, anioStr);
      }
      setModalVisible(false);
      setCategory(''); setLimit(''); setEditingId(null);
      loadData();
    } catch (e) { Alert.alert("Error", "No se pudo guardar"); }
  };

  const handleDelete = (id) => {
    Alert.alert("Eliminar", "¿Borrar presupuesto?", [
      { text: "Cancelar" },
      { text: "Eliminar", style: "destructive", onPress: async () => { await presupuestoController.eliminar(id); loadData(); } }
    ]);
  };

  const openEdit = (item) => { setEditingId(item.id); setCategory(item.categoria); setLimit(item.monto_limite.toString()); setModalVisible(true); };
  const formatMoney = (val) => `$${val.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>     
          <Image source={require('../assets/Puerquito2.jpg')} style={styles.logoIcon} />
          <View>
            <Text style={styles.greeting}>Hola, {userName}</Text>
            <Text style={styles.subGreeting}>Presupuestos</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Perfil')} style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={34} color="#0D7A43" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>Control de Gastos</Text>

        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.arrowBtn}><ChevronLeft size={24} color="#374151" /></TouchableOpacity>
          <Text style={styles.monthText}>{getMonthName(currentMonthIndex)} {currentYear}</Text>
          <TouchableOpacity onPress={() => changeMonth(1)} style={styles.arrowBtn}><ChevronRight size={24} color="#374151" /></TouchableOpacity>
        </View>

        {/* --- ZONA DE FILTROS --- */}
        <View style={styles.filtersSection}>
          {/* Filtro 1: Buscador */}
          <View style={styles.searchContainer}>
            <Search size={20} color="#9CA3AF" style={styles.searchIcon}/>
            <TextInput 
              style={styles.searchInput}
              placeholder="Buscar categoría..."
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText !== '' && <TouchableOpacity onPress={() => setSearchText('')}><X size={18} color="#9CA3AF" /></TouchableOpacity>}
          </View>

          {/* Filtro 2: Estado (Tabs) */}
          <View style={styles.statusFilters}>
            <TouchableOpacity style={[styles.statusBtn, filterStatus === 'all' && styles.statusBtnActive]} onPress={() => setFilterStatus('all')}>
              <Text style={[styles.statusBtnText, filterStatus === 'all' && styles.statusBtnTextActive]}>Todos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.statusBtn, filterStatus === 'exceeded' && styles.statusBtnActiveExceeded]} onPress={() => setFilterStatus('exceeded')}>
              <Text style={[styles.statusBtnText, filterStatus === 'exceeded' && styles.statusBtnTextActiveExceeded]}>Alertas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.statusBtn, filterStatus === 'ok' && styles.statusBtnActiveOk]} onPress={() => setFilterStatus('ok')}>
              <Text style={[styles.statusBtnText, filterStatus === 'ok' && styles.statusBtnTextActiveOk]}>Bien</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* LISTA */}
        {displayedBudgets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No se encontraron presupuestos con estos filtros.</Text>
          </View>
        ) : (
          displayedBudgets.map((b) => {
            const spent = b.monto_gastado || 0;
            const limitVal = b.monto_limite || 1;
            const percent = Math.min((spent / limitVal) * 100, 100);
            
            // Lógica de Alerta
            const isExceeded = spent >= limitVal;
            const color = isExceeded ? '#EF4444' : percent > 80 ? '#F59E0B' : '#10B981';
            
            return (
              <TouchableOpacity 
                key={b.id} 
                style={[styles.card, isExceeded && styles.cardExceeded]} 
                activeOpacity={0.9} 
                onPress={() => openEdit(b)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.catContainer}>
                    <View style={[styles.dot, { backgroundColor: color }]} />
                    <Text style={styles.catTitle}>{b.categoria}</Text>
                    {isExceeded && (
                      <View style={styles.alertBadge}>
                        <AlertTriangle size={12} color="#FFF" />
                        <Text style={styles.alertText}>AGOTADO</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(b.id)}><Trash2 size={18} color="#9CA3AF" /></TouchableOpacity>
                </View>
                
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: color }]} />
                </View>
                
                <View style={styles.cardFooter}>
                  <Text style={[styles.amountText, { color: color }]}>{formatMoney(spent)}</Text>
                  <Text style={styles.limitText}>de {formatMoney(limitVal)}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => { setEditingId(null); setCategory(''); setLimit(''); setModalVisible(true); }}>
        <Plus size={28} color="white" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? 'Editar' : 'Nuevo'} Presupuesto</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}><X size={24} color="#333"/></TouchableOpacity>
            </View>
            <Text style={styles.label}>Categoría</Text>
            <TextInput style={styles.input} placeholder="Ej. Comida" value={category} onChangeText={setCategory} />
            <Text style={styles.label}>Límite ($)</Text>
            <TextInput style={styles.input} placeholder="0.00" keyboardType="numeric" value={limit} onChangeText={setLimit} />
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}><Text style={styles.saveText}>Guardar</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  monthSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, padding: 10, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  monthText: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  arrowBtn: { padding: 5 },

  // Filtros
  filtersSection: { marginBottom: 20 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#374151' },
  
  statusFilters: { flexDirection: 'row', gap: 10 },
  statusBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF' },
  statusBtnActive: { backgroundColor: '#E8F3EC', borderColor: '#0D7A43' },
  statusBtnActiveExceeded: { backgroundColor: '#FEF2F2', borderColor: '#EF4444' },
  statusBtnActiveOk: { backgroundColor: '#F0FDF4', borderColor: '#10B981' },
  
  statusBtnText: { color: '#6B7280', fontSize: 13, fontWeight: '500' },
  statusBtnTextActive: { color: '#0D7A43', fontWeight: 'bold' },
  statusBtnTextActiveExceeded: { color: '#EF4444', fontWeight: 'bold' },
  statusBtnTextActiveOk: { color: '#10B981', fontWeight: 'bold' },

  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2, borderWidth: 1, borderColor: 'transparent' },
  cardExceeded: { borderColor: '#EF4444', backgroundColor: '#FFF5F5' }, 
  
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  catContainer: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  catTitle: { fontSize: 16, fontWeight: '700', color: '#374151' },
  
  alertBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EF4444', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, marginLeft: 8 },
  alertText: { color: '#FFF', fontSize: 10, fontWeight: 'bold', marginLeft: 3 },

  progressBg: { height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, marginBottom: 8, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  cardFooter: { flexDirection: 'row', alignItems: 'baseline' },
  amountText: { fontSize: 16, fontWeight: 'bold', marginRight: 4 },
  limitText: { fontSize: 14, color: '#9CA3AF' },
  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#4B5563' },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#0D7A43', justifyContent: 'center', alignItems: 'center', elevation: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 20, padding: 24, elevation: 5 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 10 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12, fontSize: 16 },
  saveBtn: { backgroundColor: '#0D7A43', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 24 },
  saveText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});