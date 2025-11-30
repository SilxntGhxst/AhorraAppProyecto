import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Importar pantallas
import IniciarSesionScreen from '../screens/IniciarSesionScreen';
import RegistrarScreen from '../screens/RegistrarScreen';
import RecuperarContrasenaScreen from '../screens/RecuperarContrasenaScreen';
import CambiarContrasenaScreen from '../screens/CambiarContrasenaScreen';

import AhorraAppScreen from '../screens/InicioScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import PresupuestosMensuales from '../screens/PresupuestosMensuales';
import GraficasEstadisticasScreen from '../screens/GraficasEstadisticasScreen';
import PerfilScreen from '../screens/PerfilScreen';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={IniciarSesionScreen} />
      <Stack.Screen name="Registro" component={RegistrarScreen} />
      <Stack.Screen name="RecuperarContrasena" component={RecuperarContrasenaScreen} />
      <Stack.Screen name="CambiarContrasena" component={CambiarContrasenaScreen} />
    </Stack.Navigator>
  );
}

function MainTabNavigator() {
    return (
        <Tab.Navigator
            initialRouteName="Inicio"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#0D7A43',
                tabBarInactiveTintColor: '#6B7280',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#F0F0F0',
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowOffset: { width: 0, height: -2 },
                    height: Platform.OS === 'ios' ? 95 : 75, 
                    paddingBottom: Platform.OS === 'ios' ? 30 : 12, 
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginBottom: 0 
                }
            }}
        >
            <Tab.Screen name="Inicio" component={AhorraAppScreen} options={{ title: 'Inicio', tabBarIcon: ({ color, size }) => ( <Ionicons name="home-outline" color={color} size={24} /> ), }} />
            <Tab.Screen name="Transacciones" component={TransactionsScreen} options={{ title: 'Transacciones', tabBarIcon: ({ color, size }) => ( <Ionicons name="swap-horizontal-outline" color={color} size={24} /> ), }} />
            <Tab.Screen name="Presupuestos" component={PresupuestosMensuales} options={{ title: 'Presupuestos', tabBarIcon: ({ color, size }) => ( <Ionicons name="wallet-outline" color={color} size={24} /> ), }} />
            <Tab.Screen name="Gráficas" component={GraficasEstadisticasScreen} options={{ title: 'Gráficas', tabBarIcon: ({ color, size }) => ( <Ionicons name="bar-chart-outline" color={color} size={24} /> ), }} />
            <Tab.Screen name="Perfil" component={PerfilScreen} options={{ title: 'Perfil', tabBarIcon: ({ color, size }) => ( <Ionicons name="person-circle-outline" color={color} size={24} /> ), }} />
        </Tab.Navigator>
    );
}

export default function RootNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Auth">
            <Stack.Screen name="Auth" component={AuthStack} />
            <Stack.Screen name="AppTabs" component={MainTabNavigator} />
        </Stack.Navigator>
    );
}