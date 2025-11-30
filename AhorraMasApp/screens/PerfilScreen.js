import React, { useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, 
  StatusBar, Image, TextInput, Alert, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

// Importar Controladores
import { UsuarioController } from '../controllers/UsuarioController';
import { TransaccionController } from '../controllers/TransaccionController';
import { PresupuestoController } from '../controllers/PresupuestoController';

export default function PerfilScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Datos del usuario
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState({ nombre: '', email: '', telefono: '' });
  
  // Estadísticas
  const [stats, setStats] = useState({
    transacciones: 0,
    presupuestos: 0,
    diasActivo: 0,
    totalGestionado: 0
  });

  // Instancias de Controladores
  const usuarioController = new UsuarioController();
  const transaccionController = new TransaccionController();
  const presupuestoController = new PresupuestoController();

  useFocusEffect(useCallback(() => {
    loadProfileData();
  }, []));

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const id = await SecureStore.getItemAsync('user_id');
      if (id) {
        setUserId(id);
        
        // 1. Cargar Datos del Usuario desde BD
        const user = await usuarioController.obtenerPorId(id);
        if (user) {
          setUserData({
            nombre: user.nombre,
            email: user.email,
            telefono: user.telefono || ''
          });
        }

        const transacciones = await transaccionController.obtenerTodas(id);
        const presupuestos = await presupuestoController.obtenerTodos(id);

        let dias = 1;
        if (transacciones.length > 0) {
           dias = transacciones.length; 
        }

        // Calcular dinero total gestionado (suma de todos los movimientos absolutos)
        const total = transacciones.reduce((acc, curr) => acc + Math.abs(curr.monto), 0);

        setStats({
          transacciones: transacciones.length,
          presupuestos: presupuestos.length,
          diasActivo: dias,
          totalGestionado: total
        });
      }
    } catch (error) {
      console.error("Error cargando perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await usuarioController.actualizarDatos(userId, userData.nombre, userData.telefono);
      await SecureStore.setItemAsync('user_name', userData.nombre);
      
      setIsEditing(false);
      Alert.alert("Éxito", "Perfil actualizado correctamente");
      loadProfileData(); 
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudieron guardar los cambios");
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('user_id');
    await SecureStore.deleteItemAsync('user_name');
    navigation.replace('Auth');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0D7A43" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>     
          <Image source={require('../assets/Puerquito2.jpg')} style={styles.logoIcon} />
          <View>
            <Text style={styles.greeting}>Hola, {userData.nombre.split(' ')[0]}</Text>
            <Text style={styles.subGreeting}>Mi Perfil</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutIcon}>
           <MaterialIcons name="logout" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        
        {/* Tarjeta de Información Personal (Editable) */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitle}>Información Personal</Text>
            <TouchableOpacity onPress={() => isEditing ? handleSave() : setIsEditing(true)}>
              <Text style={[styles.actionText, {color: isEditing ? '#0D7A43' : '#6B7280'}]}>
                {isEditing ? 'Guardar' : 'Editar'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre</Text>
            {isEditing ? (
              <TextInput 
                style={styles.input} 
                value={userData.nombre} 
                onChangeText={(t) => setUserData({...userData, nombre: t})}
              />
            ) : (
              <Text style={styles.valueText}>{userData.nombre}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo (No editable)</Text>
            <Text style={[styles.valueText, {color: '#999'}]}>{userData.email}</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            {isEditing ? (
              <TextInput 
                style={styles.input} 
                value={userData.telefono} 
                onChangeText={(t) => setUserData({...userData, telefono: t})}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.valueText}>{userData.telefono || 'Sin registrar'}</Text>
            )}
          </View>

          {isEditing && (
            <TouchableOpacity style={styles.cancelButton} onPress={() => { setIsEditing(false); loadProfileData(); }}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Estadísticas Reales */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Estadísticas de Uso</Text>
          <Text style={styles.sectionSubtitle}>Basado en tus registros actuales</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.transacciones}</Text>
              <Text style={styles.statLabel}>Transacciones</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.presupuestos}</Text>
              <Text style={styles.statLabel}>Presupuestos</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.diasActivo}</Text>
              <Text style={styles.statLabel}>Movimientos</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>${stats.totalGestionado.toLocaleString('es-MX', {maximumFractionDigits: 0})}</Text>
              <Text style={styles.statLabel}>Total gestionado</Text>
            </View>
          </View>
        </View>

        {/* Configuración Visual */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Notificaciones</Text>
            <Switch value={true} trackColor={{ false: '#767577', true: '#0D7A43' }} />
          </View>
        </View>

        {/* Soporte */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.helpRow}>
            <MaterialIcons name="help-outline" size={20} color="#1B3C2A" />
            <Text style={styles.helpText}>Ayuda y Soporte</Text>
          </TouchableOpacity>
          <View style={styles.divider}/>
          <Text style={styles.versionText}>AhorraMas App v1.0.0</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F3EC' },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E0E0E0', elevation: 2 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { width: 40, height: 40, marginRight: 12 },
  greeting: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  subGreeting: { fontSize: 13, color: '#0D7A43', fontWeight: '600' },
  logoutIcon: { padding: 5 },
  
  scrollContent: { padding: 20, paddingBottom: 100 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontWeight: 'bold', fontSize: 18, color: '#1B3C2A' },
  actionText: { fontSize: 16, fontWeight: '600' },
  
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 12, color: '#666', marginBottom: 4 },
  valueText: { fontSize: 16, color: '#333', fontWeight: '500' },
  input: { backgroundColor: '#F3F4F6', borderRadius: 8, padding: 10, fontSize: 16, color: '#333', borderWidth: 1, borderColor: '#0D7A43' },
  
  cancelButton: { marginTop: 10, alignItems: 'center', padding: 10 },
  cancelText: { color: '#EF4444', fontWeight: '600' },

  sectionSubtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statBox: { alignItems: 'center', width: '48%', backgroundColor: '#F9FAFB', padding: 10, borderRadius: 8 },
  statNumber: { fontWeight: 'bold', fontSize: 20, color: '#0D7A43' },
  statLabel: { color: '#666', fontSize: 12, marginTop: 4 },

  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  switchLabel: { fontSize: 16, color: '#333' },
  
  helpRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
  helpText: { fontSize: 16, color: '#333', marginLeft: 10 },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 10 },
  versionText: { textAlign: 'center', color: '#999', fontSize: 12, marginTop: 5 },
});