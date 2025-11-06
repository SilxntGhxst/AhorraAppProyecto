// Screens/EditarPerfilScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function EditarPerfilScreen({ onSave, onCancel }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Ahorra +App</Text>
        <Ionicons name="person" size={24} color="#1B3C2A" />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Título principal */}
        <Text style={styles.mainTitle}>Editar perfil</Text>

        {/* Mi perfil */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mi perfil</Text>
          <Text style={styles.sectionSubtitle}>Gestiona tu información personal</Text>
          
          <Text style={styles.label}>Nombre del usuario</Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldValue}>Tu nombre</Text>
          </View>

          <Text style={styles.label}>Correo electrónico</Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldValue}>Tu gmail.com</Text>
          </View>

          <Text style={styles.label}>Teléfono</Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldValue}>4436846887</Text>
          </View>

          <View style={styles.editButtons}>
            <TouchableOpacity style={styles.saveButton} onPress={onSave}>
              <Text style={styles.saveText}>Guardar cambios</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notificaciones */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>
          <Text style={styles.sectionSubtitle}>Configura tus preferencias de notificaciones</Text>
          
          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchLabel}>Alerta de presupuestos</Text>
              <Text style={styles.switchDescription}>Recibe alerta cuando exceda un presupuesto</Text>
            </View>
            <Switch 
              value={true} 
              trackColor={{ false: '#767577', true: '#2FB16B' }}
              thumbColor={'#f4f3f4'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchLabel}>Reporte mensual</Text>
              <Text style={styles.switchDescription}>Resumen de gastos e ingresos mensuales</Text>
            </View>
            <Switch 
              value={true} 
              trackColor={{ false: '#767577', true: '#2FB16B' }}
              thumbColor={'#f4f3f4'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchLabel}>Notificaciones por email</Text>
              <Text style={styles.switchDescription}>Recibe notificaciones en tu correo</Text>
            </View>
            <Switch 
              value={true} 
              trackColor={{ false: '#767577', true: '#2FB16B' }}
              thumbColor={'#f4f3f4'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchLabel}>Notificaciones push</Text>
              <Text style={styles.switchDescription}>Notificaciones en tiempo real en el navegador</Text>
            </View>
            <Switch 
              value={true} 
              trackColor={{ false: '#767577', true: '#2FB16B' }}
              thumbColor={'#f4f3f4'}
            />
          </View>
        </View>

        {/* Datos y privacidad */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Datos y privacidad</Text>
          <Text style={styles.sectionSubtitle}>Gestiona tus datos personales</Text>
          
          <TouchableOpacity style={styles.subButton}>
            <Text style={styles.subButtonText}>Exportar mis datos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.subButton}>
            <Text style={styles.subButtonText}>Importar datos</Text>
          </TouchableOpacity>

          <Text style={styles.privacyText}>
            Tus datos están protegidos y encriptados.{"\n"}
            Nunca compartimos tu información personal.
          </Text>

          {/* Línea divisoria */}
          <View style={styles.divider} />

          {/* Estadísticas de uso */}
          <Text style={styles.statsTitle}>Estadísticas de uso</Text>
          <Text style={styles.statsSubtitle}>Tu actividad en la App</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>127</Text>
              <Text style={styles.statLabel}>Transacciones</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Presupuestos</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>45</Text>
              <Text style={styles.statLabel}>Días activo</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>$24,500</Text>
              <Text style={styles.statLabel}>Total gestionado</Text>
            </View>
          </View>
        </View>

        {/* Soporte y ayuda */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Soporte y Ayuda</Text>
          <Text style={styles.sectionSubtitle}>Obtén ayuda cuando lo necesites</Text>
          
          <TouchableOpacity style={styles.helpRow}>
            <Text style={styles.helpText}>Centro de Ayuda</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpRow}>
            <Text style={styles.helpText}>Enviar feedback</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpRow}>
            <Text style={styles.helpText}>Calificar la App</Text>
          </TouchableOpacity>

          {/* Línea divisoria */}
          <View style={styles.divider} />

          {/* Información de la app */}
          <Text style={styles.appInfo}>Ahorra + App</Text>
          <Text style={styles.appVersion}>Versión 10.0</Text>
        </View>

        {/* Botón cerrar sesión */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Navigation Bar - Verde */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#FFFFFF" />
          <Text style={styles.navText}>Casita</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="credit-card" size={24} color="#FFFFFF" />
          <Text style={styles.navText}>Targeta</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="stats-chart" size={24} color="#FFFFFF" />
          <Text style={styles.navText}>Estadísticas</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="account-balance-wallet" size={24} color="#FFFFFF" />
          <Text style={styles.navText}>Presupuestos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#E8F3EC' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#E8F3EC',
  },
  logo: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#1B3C2A' 
  },
  scroll: { 
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B3C2A',
    marginBottom: 20,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: { 
    fontWeight: 'bold', 
    fontSize: 18, 
    marginBottom: 4,
    color: '#1B3C2A',
  },
  sectionSubtitle: { 
    fontSize: 14, 
    color: '#666',
    marginBottom: 16,
  },
  label: { 
    color: '#555', 
    fontSize: 14,
    marginBottom: 4,
    marginTop: 12,
  },
  fieldContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
  },
  editButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 20 
  },
  saveButton: {
    backgroundColor: '#2FB16B',
    borderRadius: 8,
    padding: 14,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E8F3EC',
    borderRadius: 8,
    padding: 14,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2FB16B',
  },
  saveText: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 14,
  },
  cancelText: { 
    color: '#2FB16B', 
    fontWeight: 'bold',
    fontSize: 14,
  },
  switchRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 16,
  },
  switchTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  switchDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  subButton: {
    backgroundColor: '#E8F3EC',
    borderRadius: 8,
    padding: 14,
    marginVertical: 6,
  },
  subButtonText: {
    fontSize: 16,
    color: '#1B3C2A',
    fontWeight: '500',
  },
  privacyText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B3C2A',
    marginBottom: 4,
  },
  statsSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    alignItems: 'center',
    width: '48%',
  },
  statNumber: { 
    fontWeight: 'bold', 
    fontSize: 20,
    color: '#1B3C2A',
  },
  statLabel: { 
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  helpRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  helpText: {
    fontSize: 16,
    color: '#333',
  },
  appInfo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B3C2A',
    textAlign: 'center',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E74C3C',
  },
  logoutText: { 
    color: '#E74C3C', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Navigation Bar Styles - Verde
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2FB16B',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 4,
  },
});