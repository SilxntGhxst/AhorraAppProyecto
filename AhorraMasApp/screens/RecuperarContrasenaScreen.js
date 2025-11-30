import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UsuarioController } from "../controllers/UsuarioController";

export default function RecuperarContrasenaScreen({ navigation }) {
  const [email, setEmail] = useState("");

  const usuarioController = new UsuarioController();

  const handleRecover = async () => {
    if (!email.trim()) {
      Alert.alert("Atención", "Por favor ingresa tu correo electrónico.");
      return;
    }

    try {
      const user = await usuarioController.buscarPorEmail(email);

      if (user) {
        Alert.alert(
          "Correo Enviado",
          `Se ha enviado un enlace de recuperación a ${email}.\n\nPresiona OK para continuar y crear tu nueva contraseña.`,
          [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("CambiarContrasena", { email: email });
              },
            },
          ]
        );
      } else {
        Alert.alert("Error", "Este correo no está registrado.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Ocurrió un problema al verificar.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#E9F9F0" barStyle="dark-content" />
      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#0D7A43" />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Image
            source={require("../assets/piglogo.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Recuperar Acceso</Text>
          <Text style={styles.subtitle}>
            Ingresa tu correo para buscar tu cuenta.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="ejemplo@correo.com"
            placeholderTextColor="#A0A0A0"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.button} onPress={handleRecover}>
            <Text style={styles.buttonText}>Buscar Cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E9F9F0" },
  content: { flex: 1, padding: 24, justifyContent: "center" },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  headerContainer: { alignItems: "center", marginBottom: 40 },
  logo: { width: 60, height: 60, marginBottom: 16, tintColor: "#0D7A43" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  form: { width: "100%" },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1F2937",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  button: {
    backgroundColor: "#0D7A43",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#0D7A43",
    shadowOpacity: 0.2,
    elevation: 4,
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});