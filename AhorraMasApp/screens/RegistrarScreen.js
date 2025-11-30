import React, { useState } from 'react';
import { 
  Text, StyleSheet, View, SafeAreaView, ImageBackground, 
  TextInput, TouchableOpacity, Alert, Image, Switch, 
  KeyboardAvoidingView, Platform, ScrollView 
} from 'react-native';
import { UsuarioController } from '../controllers/UsuarioController';

export default function RegistrarScreen({ navigation }) {
  
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [isAccepted, setIsAccepted] = useState(false);
  const userController = new UsuarioController();

  const handleRegister = async () => {
    if(nombre.trim() === '' || correo.trim() === '' || contrasena.trim() === '' || telefono.trim() === '') {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!correoRegex.test(correo)){
       Alert.alert("Error", "Ingresa un correo válido");
       return;
    }
    
    if (!isAccepted) {
       Alert.alert('Error', 'Debes aceptar los términos y condiciones');
       return;
    }

    try {
      await userController.registrar(nombre, correo, telefono, contrasena); // <--- USO DEL CONTROLADOR
      Alert.alert("¡Éxito!", "Cuenta creada.", [{ text: "Ir al Login", onPress: () => navigation.navigate('Login') }]);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "No se pudo registrar (posible correo duplicado).");
    }
  };

  return (
    <ImageBackground source={require('../assets/fondo.png')} style={styles.background} resizeMode="cover">
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex:1}}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              
              <View style={styles.header}>
                <Image source={require('../assets/piglogo.png')} style={styles.logo} />
                <Text style={styles.titulo}>Crear Cuenta</Text>
                <Text style={styles.subtitulo}>Únete a Ahorra +App</Text>
              </View>

              <TextInput style={styles.input} placeholder="Nombre completo" placeholderTextColor="#999" value={nombre} onChangeText={setNombre} />
              <TextInput style={styles.input} placeholder="Correo electrónico" placeholderTextColor="#999" value={correo} onChangeText={setCorreo} keyboardType="email-address" autoCapitalize="none" />
              <TextInput style={styles.input} placeholder="Teléfono" placeholderTextColor="#999" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
              <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#999" secureTextEntry value={contrasena} onChangeText={setContrasena} />

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Acepto los términos y condiciones</Text>
                <Switch value={isAccepted} onValueChange={setIsAccepted} trackColor={{ false: "#E5E7EB", true: "#A7F3D0" }} thumbColor={isAccepted ? "#0D7A43" : "#f4f3f4"} />
              </View>
              
              <TouchableOpacity style={styles.button} onPress={handleRegister} activeOpacity={0.8}>
                <Text style={styles.buttonText}>Registrarme</Text>
              </TouchableOpacity>

              {/* Botón para ir al Login */}
              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.linkText}>Inicia Sesión</Text>
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 5,
  },
  header: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 50, height: 50, tintColor: '#0D7A43', marginBottom: 10 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  subtitulo: { fontSize: 14, color: '#6B7280' },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#1F2937',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  switchLabel: { fontSize: 14, color: '#4B5563' },
  button: {
    backgroundColor: '#0D7A43',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: "#0D7A43",
    shadowOpacity: 0.3,
    elevation: 4,
  },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerText: { color: '#6B7280', fontSize: 15 },
  linkText: { color: '#0D7A43', fontWeight: 'bold', fontSize: 15 },
});