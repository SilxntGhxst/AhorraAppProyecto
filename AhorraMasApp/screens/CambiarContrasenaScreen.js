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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { UsuarioController } from "../controllers/UsuarioController";

export default function CambiarContrasenaScreen({ route, navigation }) {
  const { email } = route.params || {}; 
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const usuarioController = new UsuarioController();

  const handleChangePassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "Por favor llena ambos campos.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    try {
      await usuarioController.actualizarPassword(email, newPassword);
      
      Alert.alert(
        "¡Éxito!",
        "Tu contraseña ha sido actualizada correctamente.",
        [{ text: "Iniciar Sesión", onPress: () => navigation.popToTop() }] 
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo actualizar la contraseña.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#E9F9F0" barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <Image
              source={require("../assets/piglogo.png")}
              style={styles.logo}
            />
            <Text style={styles.title}>Nueva Contraseña</Text>
            <Text style={styles.subtitle}>
              Ingresa tu nueva contraseña para la cuenta asociada a: {email}
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Nueva Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#A0A0A0"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <Text style={styles.label}>Confirmar Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#A0A0A0"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleChangePassword}
            >
              <Text style={styles.buttonText}>Actualizar Contraseña</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E9F9F0" },
  content: { flex: 1, padding: 24, justifyContent: "center" },
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
    paddingHorizontal: 10,
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
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  button: {
    backgroundColor: "#0D7A43",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#0D7A43",
    shadowOpacity: 0.2,
    elevation: 4,
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});