// Screens/EditarPerfilScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, Feather, FontAwesome } from '@expo/vector-icons';

export default function EditarPerfilScreen({ onSave, onCancel }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Ahorra +App</Text>
        <Ionicons name="settings-outline" size={22} color="#1B3C2A" />
      </View>

      <ScrollView style={styles.scroll}>
        {/* Mi perfil (editable) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mi perfil</Text>
          <Text style={styles.label}>Nombre de usuario</Text>
          <TextInput style={styles.input} placeholder="User123" />

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput style={styles.input} placeholder="usuario@email.com" />

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
          <Text style={styles.cardTitle}>Notificaciones</Text>
          <View style={styles.switchRow}>
            <Text>Alertas de presupuesto</Text>
            <Switch value={true} />
          </View>
          <View style={styles.switchRow}>
            <Text>Reportes mensuales</Text>
            <Switch value={true} />
          </View>
          <View style={styles.switchRow}>
            <Text>Notificaciones por email</Text>
            <Switch value={true} />
          </View>
        </View>

        {/* Datos y privacidad */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Datos y privacidad</Text>
          <TouchableOpacity style={styles.subButton}>
            <Text>Exportar mis datos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.subButton}>
            <Text>Eliminar cuenta</Text>
          </TouchableOpacity>
        </View>

        {/* Estadísticas de uso */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Estadísticas de uso</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>127</Text>
              <Text style={styles.statLabel}>Transacciones</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>45</Text>
              <Text style={styles.statLabel}>Ahorros</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>$24,500</Text>
              <Text style={styles.statLabel}>Balance</Text>
            </View>
          </View>
        </View>

        {/* Soporte y ayuda */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Soporte y Ayuda</Text>
          <TouchableOpacity style={styles.helpRow}>
            <MaterialIcons name="help-outline" size={20} color="#1B3C2A" />
            <Text>Centro de ayuda</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpRow}>
            <Feather name="message-square" size={20} color="#1B3C2A" />
            <Text>Enviar feedback</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpRow}>
            <FontAwesome name="star-o" size={20} color="#1B3C2A" />
            <Text>Calificar la App</Text>
          </TouchableOpacity>
        </View>

        {/* Botón cerrar sesión */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Ionicons name="home-outline" size={24} color="#1B3C2A" />
        <Ionicons name="stats-chart-outline" size={24} color="#1B3C2A" />
        <Ionicons name="person" size={24} color="#2FB16B" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F3EC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  logo: { fontSize: 20, fontWeight: 'bold', color: '#1B3C2A' },
  scroll: { paddingHorizontal: 15 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  label: { color: '#555', marginTop: 6 },
  input: {
    backgroundColor: '#E8F3EC',
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
  },
  editButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  saveButton: {
    backgroundColor: '#2FB16B',
    borderRadius: 10,
    padding: 10,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    width: '48%',
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: 'bold' },
  cancelText: { color: '#1B3C2A', fontWeight: 'bold' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  subButton: {
    backgroundColor: '#E8F3EC',
    borderRadius: 10,
    padding: 10,
    marginVertical: 4,
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statBox: { alignItems: 'center' },
  statNumber: { fontWeight: 'bold', fontSize: 18 },
  statLabel: { color: '#666' },
  helpRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  logoutButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#D7EADF',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#C4D8C8',
  },
});
