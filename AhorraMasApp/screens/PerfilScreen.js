import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

export default function PerfilScreen({ navigation }) {
  const [userName, setUserName] = useState('Usuario');
  const [userEmail, setUserEmail] = useState('cargando...');

  useFocusEffect(useCallback(() => {
    const loadUserData = async () => {
      const name = await SecureStore.getItemAsync('user_name');
      // Aquí podrías guardar el email en securestore al login para mostrarlo
      if (name) setUserName(name);
    };
    loadUserData();
  }, []));

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('user_id');
    await SecureStore.deleteItemAsync('user_name');
    navigation.replace('Auth');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* HEADER CONSISTENTE */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>     
          <Image source={require('../assets/Puerquito2.jpg')} style={styles.logoIcon} />
          <View>
            <Text style={styles.greeting}>Hola, {userName.split(' ')[0]}</Text>
            <Text style={styles.subGreeting}>Mi Perfil</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionSubtitle}>Gestiona tu información personal</Text>

        <View style={styles.card}>
          <View style={styles.userInfoSection}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={50} color="#2FB16B" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.userEmail}>{userEmail}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editProfileButton} onPress={() => navigation.navigate('EditarPerfil')}>
            <Text style={styles.editProfileText}>Editar perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Resto de secciones (Visuales) */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Alertas de presupuesto</Text>
            <Switch value={true} trackColor={{ false: '#767577', true: '#2FB16B' }} />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F3EC' },
  // HEADER COMPARTIDO
  header: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E0E0E0', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { width: 40, height: 40, marginRight: 12 },
  greeting: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  subGreeting: { fontSize: 13, color: '#0D7A43', fontWeight: '600' },

  scrollContent: { padding: 20, paddingBottom: 100 },
  sectionSubtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  userInfoSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatarContainer: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#E8F3EC', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#1B3C2A', marginBottom: 4 },
  userEmail: { fontSize: 16, color: '#666' },
  editProfileButton: { backgroundColor: '#2FB16B', borderRadius: 8, padding: 16, alignItems: 'center' },
  editProfileText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  sectionTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 16, color: '#1B3C2A' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  switchLabel: { fontSize: 16, fontWeight: '500', color: '#333' },
  logoutButton: { backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E74C3C', marginTop: 20 },
  logoutText: { color: '#E74C3C', fontWeight: 'bold', fontSize: 16 },
});