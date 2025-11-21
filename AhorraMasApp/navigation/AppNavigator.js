

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';


import AhorraAppScreen from '../screens/InicioScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import PresupuestosMensuales from '../screens/PresupuestosMensuales';
import GraficasEstadisticasScreen from '../screens/GraficasEstadisticasScreen';
import PerfilScreen from '../screens/PerfilScreen';
import EditarPerfilScreens from '../screens/EditarPerfilScreens';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


function PerfilStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PerfilMain" component={PerfilScreen} />
            <Stack.Screen name="EditarPerfil" component={EditarPerfilScreens} />
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
                    paddingBottom: 5,
                    height: 60,
                },
            }}
        >
            <Tab.Screen
                name="Inicio"
                component={AhorraAppScreen}
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name="Transacciones"
                component={TransactionsScreen}
                options={{
                    title: 'Transacciones',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="swap-horizontal-outline" color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name="Presupuestos"
                component={PresupuestosMensuales}
                options={{
                    title: 'Presupuestos',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="wallet-outline" color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name="Gráficas"
                component={GraficasEstadisticasScreen}
                options={{
                    title: 'Gráficas',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="bar-chart-outline" color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name="Perfil"
                component={PerfilStack}
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-circle-outline" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default MainTabNavigator;