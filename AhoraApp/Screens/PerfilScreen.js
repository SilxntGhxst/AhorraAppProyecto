import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function PerfilScreen({ irAEditar }) {
  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.logo}>Ahorra + App</Text>
        <Ionicons name="settings-outline" size={24} color="#2FB16B" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Perfil */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mi perfil</Text>
          <View style={styles.profileRow}>
            <Ionicons name="person-circle-outline" size={50} color="#2FB16B" />
            <View>
              <Text style={styles.userName}>Sele Lira</Text>
              <Text style={styles.userEmail}>user@gmail.com</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={irAEditar}>
            <Text style={styles.editButtonText}>Editar perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Notificaciones */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notificaciones</Text>
          {["Alerta de presupuesto", "Reporte mensual", "Notificaciones por email", "Notificaciones push"].map((label, i) => (
            <View key={i} style={styles.switchRow}>
              <Text style={styles.switchText}>{label}</Text>
              <Switch value={true} thumbColor="#2FB16B" />
            </View>
          ))}
        </View>

        {/* Datos y privacidad */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Datos y privacidad</Text>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>Exportar mis datos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>Eliminar mi cuenta</Text>
          </TouchableOpacity>
        </View>

        {/* Estadísticas */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Estadísticas de uso</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>127</Text>
              <Text style={styles.statLabel}>Días</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>45</Text>
              <Text style={styles.statLabel}>Logros</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>$24,500</Text>
              <Text style={styles.statLabel}>Ahorro total</Text>
            </View>
          </View>
        </View>

        {/* Soporte y Ayuda */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Soporte y Ayuda</Text>
          <View style={styles.optionRow}>
            <MaterialIcons name="help-outline" size={22} color="#2FB16B" />
            <Text style={styles.optionText}>Centro de Ayuda</Text>
          </View>
          <View style={styles.optionRow}>
            <Ionicons name="chatbox-ellipses-outline" size={22} color="#2FB16B" />
            <Text style={styles.optionText}>Enviar feedback</Text>
          </View>
          <View style={styles.optionRow}>
            <FontAwesome5 name="star" size={20} color="#2FB16B" />
            <Text style={styles.optionText}>Calificar la App</Text>
          </View>
        </View>

        {/* Cerrar sesión */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Ionicons name="home-outline" size={25} color="#fff" />
        <Ionicons name="bar-chart-outline" size={25} color="#fff" />
        <Ionicons name="person-outline" size={25} color="#fff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F3EC' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
  },
  logo: { fontSize: 20, fontWeight: 'bold', color: '#2FB16B' },
  scrollContent: { padding: 15, paddingBottom: 100 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  userName: { fontWeight: 'bold', fontSize: 16 },
  userEmail: { color: '#555' },
  editButton: {
    backgroundColor: '#2FB16B',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButtonText: { color: '#fff', fontWeight: 'bold' },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  switchText: { fontSize: 14 },
  optionButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionText: { color: '#333' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  stat: { alignItems: 'center' },
  statValue: { fontWeight: 'bold', fontSize: 16 },
  statLabel: { color: '#555' },
  optionRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  logoutButton: {
    backgroundColor: '#D9534F',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#2FB16B',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
});
