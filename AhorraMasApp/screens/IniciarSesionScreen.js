import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { UsuarioController } from '../controllers/UsuarioController';
import * as SecureStore from 'expo-secure-store';

export default function IniciarSesionScreen({ navigation }) { 
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const userController = new UsuarioController();

  const iniciarSesion = async () => {
    if (correo.trim() === "") {
      Alert.alert("Atención", "Por favor ingresa tu correo");
      return;
    }
    if (contrasena.trim() === "") {
      Alert.alert("Atención", "Por favor ingresa tu contraseña");
      return;
    }

    try {
      // Verificación real en la base de datos
      const user = await userController.login(correo, contrasena);
      
      if (user) {
        await SecureStore.setItemAsync('user_id', user.id.toString());
        if (user.nombre) {
          await SecureStore.setItemAsync('user_name', user.nombre);
        }
        navigation.replace('AppTabs'); // Entrar a la app
      } else {
        Alert.alert("Error", "Correo o contraseña incorrectos. Verifica tus datos o regístrate.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Ocurrió un problema al intentar iniciar sesión.");
    }
    
  };

  return (
    <ImageBackground
      source={require("../assets/fondo.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
              
              {/* Logo e Introducción */}
              <View style={styles.iconContainer}>
                <Image source={require("../assets/piglogo.png")} style={styles.icono} />
              </View>
              <Text style={styles.titulo}>Ahorra +App</Text>
              <Text style={styles.subtitulo}>¡Bienvenido de nuevo!</Text>

              {/* Inputs */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Correo electrónico"
                  placeholderTextColor="#999"
                  value={correo}
                  onChangeText={setCorreo}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={contrasena}
                  onChangeText={setContrasena}
                />
              </View>

              <TouchableOpacity onPress={() => navigation.navigate('RecuperarContrasena')}>
                <Text style={styles.forgotPass}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>

              {/* Botón Principal */}
              <TouchableOpacity
                style={styles.BotonInicio}
                onPress={iniciarSesion}
                activeOpacity={0.8}
              >
                <Text style={styles.TextBoton}>Iniciar Sesión</Text>
              </TouchableOpacity>

              {/* Redes Sociales */}
              <Text style={styles.socialText}>O inicia con</Text>
              <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialIcon}>
                  <Image source={require("../assets/flogo.png")} style={styles.socialImg} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon}>
                  <Image source={require("../assets/glogo.png")} style={styles.socialImg} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon}>
                  <Image source={require("../assets/xlogo.png")} style={styles.socialImg} />
                </TouchableOpacity>
              </View>

              {/* --- AQUÍ ESTÁ EL CAMBIO QUE PEDISTE --- */}
              {/* Botón de Registro al final */}
              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
                  <Text style={styles.registerLink}>Regístrate aquí</Text>
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
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  iconContainer: {
    backgroundColor: "#E9F9F0",
    padding: 16,
    borderRadius: 50,
    marginBottom: 16,
  },
  icono: { width: 40, height: 40, tintColor: '#0D7A43' },
  titulo: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: { width: '100%', marginBottom: 10 },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    fontSize: 16,
    color: "#1F2937",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  forgotPass: {
    alignSelf: 'flex-end',
    color: '#0D7A43',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 24,
    width: '100%',
    textAlign: 'right'
  },
  BotonInicio: {
    backgroundColor: "#0D7A43",
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: 'center',
    shadowColor: "#0D7A43",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  TextBoton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  socialText: {
    marginTop: 24,
    marginBottom: 16,
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "500",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 24,
  },
  socialIcon: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  socialImg: { width: 24, height: 24 },
  
  // Estilos para el footer (Registro)
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    width: '100%',
    justifyContent: 'center',
  },
  footerText: {
    color: '#6B7280',
    fontSize: 15,
  },
  registerLink: {
    color: '#0D7A43',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
