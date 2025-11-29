import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, ScrollView, Image, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // SafeAreaView consistente
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2, X } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { getBudgets, addBudget, updateBudget, deleteBudget } from '../services/DBService';
import { PresupuestoController } from '../controllers/PresupuestoController';

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

export default function PresupuestosMensuales({ navigation }) {
  const presupuestoController = new PresupuestoController();
  const [userName, setUserName] = useState('Usuario');
  
  const now = new Date();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [budgets, setBudgets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');

  const getMonthName = (index) => months[index];

  const loadData = async () => {
    try {
      const userId = await SecureStore.getItemAsync('user_id');
      if (userId) {
        const mesNombre = getMonthName(currentMonthIndex);
        const anioStr = currentYear.toString();
        const data = await presupuestoController.obtenerConGasto(userId, mesNombre, anioStr); // <--- USO DEL CONTROLADOR
        setBudgets(data);
      }
    } catch (error) { console.error(error); }
  };

  useFocusEffect(useCallback(() => { loadData(); }, [currentMonthIndex, currentYear]));

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
     
      await presupuestoController.actualizar(
        editingId,
        category,
        parseFloat(limit)
      );
    } else {
      
      await presupuestoController.agregar(
        userId,
        category,
        parseFloat(limit),
        mesNombre,
        anioStr
      );
    }

    setModalVisible(false);
    setCategory('');
    setLimit('');
    setEditingId(null);
    loadData();

  } catch (e) {
    Alert.alert("Error", "No se pudo guardar");
  }
};


 const handleDelete = (id) => {
  Alert.alert(
    "Eliminar",
    "¿Borrar presupuesto?",
    [
      { text: "Cancelar" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          
          await presupuestoController.eliminar(id);
          loadData();
        }
      }
    ]
  );
};


  const openEdit = (item) => { setEditingId(item.id); setCategory(item.categoria); setLimit(item.monto_limite.toString()); setModalVisible(true); };
  const formatMoney = (val) => `$${val.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* HEADER CONSISTENTE */}
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

        {budgets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No hay presupuestos definidos.</Text>
          </View>
        ) : (
          budgets.map((b) => {
            const spent = b.monto_gastado || 0;
            const limitVal = b.monto_limite || 1;
            const percent = Math.min((spent / limitVal) * 100, 100);
            const color = percent >= 100 ? '#EF4444' : percent > 80 ? '#F59E0B' : '#10B981';
            return (
              <TouchableOpacity key={b.id} style={styles.card} activeOpacity={0.9} onPress={() => openEdit(b)}>
                <View style={styles.cardHeader}>
                  <View style={styles.catContainer}>
                    <View style={[styles.dot, { backgroundColor: color }]} />
                    <Text style={styles.catTitle}>{b.categoria}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(b.id)}><Trash2 size={18} color="#9CA3AF" /></TouchableOpacity>
                </View>
                <View style={styles.progressBg}><View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: color }]} /></View>
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
  // ESTILOS HEADER COMPARTIDOS
  header: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E0E0E0', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { width: 40, height: 40, marginRight: 12 },
  greeting: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  subGreeting: { fontSize: 13, color: '#0D7A43', fontWeight: '600' },
  profileButton: { padding: 4 },

  scrollContent: { padding: 20, paddingBottom: 100 },
  screenTitle: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 20 },
  monthSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, padding: 10, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  monthText: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  arrowBtn: { padding: 5 },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  catContainer: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  catTitle: { fontSize: 16, fontWeight: '700', color: '#374151' },
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