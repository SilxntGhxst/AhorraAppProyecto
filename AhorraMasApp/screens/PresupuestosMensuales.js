// screens/PresupuestosMensuales.js

import React, { useState, useCallback } from 'react'; // 1. AGREGAR useCallback
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ScrollView,
  Image,
  Modal,      // 2. IMPORTAR Componentes necesarios
  TextInput,
  Alert
} from 'react-native';
import { 
  ChevronDown,
  Plus,
  Edit2,
  Trash2,
  X // Icono cerrar
} from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';

// 3. IMPORTS DE BASE DE DATOS
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { getBudgets, addBudget } from '../services/DBService'; // Asegúrate de tener estas funciones en DBService

const PresupuestosMensuales = () => {
  const [selectedMonth, setSelectedMonth] = useState('Septiembre');
  const [selectedYear, setSelectedYear] = useState('2025');
  
  // 4. ESTADOS PARA DATOS DINÁMICOS
  const [budgets, setBudgets] = useState([]); 
  const [modalVisible, setModalVisible] = useState(false);
  
  // Estados para el formulario
  const [newCategory, setNewCategory] = useState('');
  const [newLimit, setNewLimit] = useState('');

  // 5. FUNCIÓN PARA CARGAR PRESUPUESTOS
  const loadBudgets = async () => {
    try {
      const userId = await SecureStore.getItemAsync('user_id');
      if (userId) {
        // Aquí cargamos los presupuestos filtrados por mes/año (si tu BD lo soporta)
        // Por simplicidad del ejemplo, cargamos todos o filtras en JS
        const data = await getBudgets(userId, selectedMonth, selectedYear);
        setBudgets(data);
      }
    } catch (error) {
      console.error("Error cargando presupuestos:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBudgets();
    }, [selectedMonth, selectedYear]) // Recargar si cambia el mes
  );

  // 6. GUARDAR NUEVO PRESUPUESTO
  const handleSaveBudget = async () => {
    if (!newCategory || !newLimit) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }
    try {
      const userId = await SecureStore.getItemAsync('user_id');
      // Guardamos en la BD
      await addBudget(userId, newCategory, parseFloat(newLimit), selectedMonth, selectedYear);
      
      Alert.alert("Éxito", "Presupuesto creado");
      setModalVisible(false);
      setNewCategory('');
      setNewLimit('');
      loadBudgets(); // Recargar lista
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo guardar");
    }
  };

  // Cálculos auxiliares
  const calculatePercentage = (spent, limit) => {
    if (!limit) return 0;
    return Math.min((spent / limit) * 100, 100);
  };

  const getStatusColor = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return '#EF4444'; // Rojo
    if (percentage >= 80) return '#F59E0B';  // Naranja
    return '#10B981';                        // Verde
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* ... HEADER (Mismo código que tenías) ... */}
      <View style={styles.header}>
        <View style={styles.iconContent}>     
          <Image source={require('../assets/Puerquito2.jpg')} style={styles.icono} />
          <Text style={styles.logoText}>Ahorra +App</Text>
        </View>
        <View style={styles.profileIcon}>
          <Ionicons name="person-circle-outline" size={32} color="#0D7A43" />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* SECCIÓN TÍTULO + BOTÓN AGREGAR */}
        <View style={styles.titleSection}>
          <View>
            <Text style={styles.titleText}>Presupuestos</Text>
            <Text style={styles.titleText}>Mensuales</Text>
            <Text style={styles.subtitleText}>Gestiona tus límites</Text>
          </View>
          {/* 7. BOTÓN CONECTADO AL MODAL */}
          <TouchableOpacity 
            style={styles.newBudgetButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.newBudgetText}>+ Nuevo</Text>
          </TouchableOpacity>
        </View>

        {/* ... SELECTOR DE PERIODO (Mismo código visual) ... */}
        <View style={styles.periodCard}>
           {/* Puedes mantener tu selector visual aquí */}
           <Text style={styles.periodLabel}>Periodo: {selectedMonth} {selectedYear}</Text>
        </View>

        {/* LISTA DE PRESUPUESTOS DINÁMICA */}
        {budgets.length === 0 ? (
          <View style={styles.emptyStateCard}>
            <Text style={styles.emptyStateText}>No hay presupuestos definidos.</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={{color: '#0D7A43', fontWeight: 'bold', marginTop: 10}}>Crear uno ahora</Text>
            </TouchableOpacity>
          </View>
        ) : (
          budgets.map((budget) => {
            // Mapeo de datos de la BD a variables visuales
            const spent = budget.monto_gastado || 0; 
            const limit = budget.monto_limite || 0;
            const percentage = calculatePercentage(spent, limit);
            const statusColor = getStatusColor(spent, limit);
            const remaining = limit - spent;

            return (
              <View key={budget.id} style={styles.budgetCard}>
                <View style={styles.budgetHeader}>
                  <View style={styles.budgetLeft}>
                    {/* Icono genérico o basado en categoría */}
                    <View style={[styles.categoryIcon, { backgroundColor: statusColor + '20' }]}>
                      <Text style={styles.categoryEmoji}>💰</Text>
                    </View>
                    <View style={styles.budgetInfo}>
                      <Text style={styles.categoryName}>{budget.category || budget.categoria}</Text>
                      <Text style={styles.budgetSubtext}>
                        ${spent} de ${limit}
                      </Text>
                    </View>
                  </View>
                  {/* Botones de acción (puedes conectar Delete aquí similar al paso 3) */}
                  <Trash2 size={20} color="#ccc" />
                </View>

                <View style={styles.budgetProgressContainer}>
                  <View style={styles.budgetProgressBar}>
                    <View 
                      style={[
                        styles.budgetProgress, 
                        { 
                          width: `${percentage}%`,
                          backgroundColor: statusColor 
                        }
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

      {/* 8. MODAL PARA CREAR PRESUPUESTO */}
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
              placeholder="Ej. Comida, Renta..."
              value={newCategory}
              onChangeText={setNewCategory}
            />

            <Text style={styles.label}>Límite Mensual ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="numeric"
              value={newLimit}
              onChangeText={setNewLimit}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveBudget}>
              <Text style={styles.saveButtonText}>Guardar Presupuesto</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

// 9. AGREGAR ESTILOS DEL MODAL (Copia los mismos del paso 3 al final de tu StyleSheet)
const styles = StyleSheet.create({
  // ... tus estilos existentes ...
  
  // Agrega estos si no los tienes (son los mismos del modal de transacciones):
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', // Centrado o flex-end según prefieras
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  label: { fontSize: 14, color: '#666', marginBottom: 5, marginTop: 10 },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#0D7A43',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: { color: 'white', fontWeight: 'bold' },
  // ... Resto de estilos
});

export default PresupuestosMensuales;