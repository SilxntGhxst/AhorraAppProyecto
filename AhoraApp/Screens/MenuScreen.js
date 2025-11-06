import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import PerfilScreen from './PerfilScreen';
import EditarPerfilScreen from './EditarPerfilScreen';

export default function MenuScreen() {
  const [pantalla, setPantalla] = useState('menu'); // Controla qué pantalla se ve

  const renderPantalla = () => {
    switch (pantalla) {
      case 'perfil':
        return (
          <PerfilScreen
            irAEditar={() => setPantalla('editar')}
            volver={() => setPantalla('menu')}
          />
        );

      case 'editar':
        return (
          <EditarPerfilScreen
            volverPerfil={() => setPantalla('perfil')}
            volverMenu={() => setPantalla('menu')}
          />
        );

      default:
        return (
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Menú Principal</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => setPantalla('perfil')}
            >
              <Text style={styles.buttonText}>Ir al perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#6c757d', marginTop: 10 }]}
              onPress={() => console.log('Otra opción')}
            >
              <Text style={styles.buttonText}>Otra opción</Text>
            </TouchableOpacity>
          </ScrollView>
        );
    }
  };

  return renderPantalla();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F3EC',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#1B3C2A',
  },
  button: {
    backgroundColor: '#2FB16B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
