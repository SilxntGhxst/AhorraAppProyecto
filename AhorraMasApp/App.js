import React, { useEffect, useState } from 'react'; 
import { View, ActivityIndicator, StyleSheet } from 'react-native'; 
import { NavigationContainer } from '@react-navigation/native'; 
import { initDB } from './database/DatabaseConnection'; // <--- CAMBIO AQUÍ
import RootNavigator from './navigation/AppNavigator'; 

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await initDB(); 
      } catch (e) {
        console.warn("Error DB:", e);
      } finally {
        setIsReady(true);
      }
    };
    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0D7A43" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootNavigator /> 
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E9F9F0' },
});