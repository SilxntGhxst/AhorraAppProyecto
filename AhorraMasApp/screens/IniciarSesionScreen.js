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
} from "react-native";
import { findUser } from '../services/DBService';
import * as SecureStore from 'expo-secure-store'; // O AsyncStorage

export default function IniciarSesionScreen({ navigation }) { 
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const iniciarSesion = () => {
    if (correo.trim() === "") {
      Alert.alert("Error", "Por favor Ingresa un Correo");
      return;
    }
    if (contrasena.trim() === "") {
      Alert.alert("Error", "Por favor Ingresa tu Contraseña");
      return;
    }
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(correo)) {
      Alert.alert("Error", "Por favor, Ingresa una dirección de correo válida");
      return;
    } 

    findUser(correo, contrasena)
      .then(async (user) => {
        if (user) {
          await SecureStore.setItemAsync('user_id', user.id.toString());
          if (user.nombre) {
            await SecureStore.setItemAsync('user_name', user.nombre);
          }


          Alert.alert("Bienvenido", "Has iniciado sesión correctamente");

          navigation.replace('AppTabs'); 
          
        } else {
          Alert.alert("Error", "Correo o contraseña incorrectos.");
        }
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Error", "Ocurrió un problema al intentar iniciar sesión.");
      });
      
    setCorreo("");
    setContrasena("");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/fondo.png")}
        style={styles.background}
        resizeMode="repeat"
      >
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Image
              source={require("../assets/piglogo.png")}
              style={styles.icono}
            />
          </View>

          <Text style={styles.titulo}>Ahorra +App</Text>
          <Text style={styles.subtitulo}>Gestiona tus finanzas personales</Text>

          <Text style={styles.subtitulo}>Aun no tienes cuenta:</Text>

          <View style={styles.tabContainer}>
            <TouchableOpacity style={styles.tabRegis}>
              <Text style={styles.socialText}>Registrate</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitulo2}>Inicia Sesión</Text>

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#999"
            value={correo}
            onChangeText={setCorreo}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            secureTextEntry
            value={contrasena}
            onChangeText={setContrasena}
          />

          <TouchableOpacity>
            <Text style={styles.Contra}>¿Has olvidado tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.BotonInicio}
            onPress={iniciarSesion}
            activeOpacity={0.8}
          >
            <Text style={styles.TextBoton}>Inicia Sesión</Text>
          </TouchableOpacity>

          <Text style={styles.socialText}>----------o-----------</Text>
          <Text style={styles.socialText}>Iniciar sesión con:</Text>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialIcon}>
              <Image
                source={require("../assets/flogo.png")}
                style={styles.icono}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Image
                source={require("../assets/glogo.png")}
                style={styles.icono}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Image
                source={require("../assets/xlogo.png")}
                style={styles.icono}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#CFF6DD",
  },
  card: {
    backgroundColor: "#ffffff94",
    width: "85%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: "#DFFBEA",
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#21825C",
    textAlign: "center",
  },
  subtitulo: {
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitulo2: {
    fontSize: 22,
    color: "#21825C",
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#e8e8e846",
    borderRadius: 25,
    marginBottom: 20,
    width: "100%",
  },
  tabRegis: {
    flex: 1,
    borderRadius: 24,
    alignItems: "center",
    backgroundColor: "#ffffff21",
  },
  tabActive: {
    backgroundColor: "#fff",
  },

  input: {
    width: "100%",
    height: 45,
    backgroundColor: "#E8E8E8",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  Contra: {
    color: "#007BFF",
    fontSize: 14,
    alignSelf: "stretch",
    marginBottom: 15,
    fontWeight: "500",
  },
  BotonInicio: {
    backgroundColor: "#437C68",
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
  },
  TextBoton: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  socialText: {
    marginBottom: 15,
    color: "#333",
    fontWeight: "500",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
  },
  socialIcon: {
    backgroundColor: "#ffffff3b",
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  icono: {
    width: 30,
    height: 30,
  },
});
