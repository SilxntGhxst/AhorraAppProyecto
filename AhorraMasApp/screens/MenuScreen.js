import { Text, StyleSheet, View, Button,  Image } from 'react-native'
import React, { Component, useState } from 'react'
import IniciarSesionScreen from './IniciarSesionScreen'
import RegistrarScreen from './RegistrarScreen'
import EditarPerfilScreens from './EditarPerfilScreens'
import GraficasEstadisticasScreen from './GraficasEstadisticasScreen'
import MonthlyBudgetsScreen from './MonthlyBudgetsScreen'
import PerfilScreen from './PerfilScreen'
import TransactionsScreen from './TransactionsScreen'




export default function MenuScreen() {

    const[screen, setScreen]=useState('menu')

    switch(screen){

        case 'IniciarSesion': 
            return <IniciarSesionScreen/>
        case'Registrar':
        return <RegistrarScreen/>
        case 'Perfil':
          return <PerfilScreen/>
        case 'EditarPerfil':
          return <EditarPerfilScreens/>
        case 'Transacciones':
          return <TransactionsScreen/>
        case 'Graficas':
          return <GraficasEstadisticasScreen/>
        case 'Mes':
          return <MonthlyBudgetsScreen/>
     
        case 'menu':
            default:
            return (

      <View style={styles.container2}>
        
         <View style={styles.card}>
          <View style={styles.iconContainer}>
        <Image
          source={require('../assets/piglogo.png')}
          style={styles.icono}
           />
        </View>
        <Text  style={styles.texto2}>Ahorra+App</Text>
        <Text  style={styles.texto3}>Menú Screens </Text>
        


        <View style={styles.contenedorBotones2}>
        <Button color="#2AA63E" onPress={()=>setScreen('IniciarSesion')} title='Screen Iniciar sesión'/>
        <Button color="#2AA63E" onPress={()=>setScreen('Registrar')} title='Screen Registrar'/>
        <Button color="#2AA63E" onPress={()=>setScreen('Perfil')} title='Screen Perfil'/>
        <Button color="#2AA63E" onPress={()=>setScreen('EditarPerfil')} title='Screen Editar Perfil'/>
        <Button color="#2AA63E" onPress={()=>setScreen('Transacciones')} title='Screen Transacciones'/>
        <Button color="#2AA63E" onPress={()=>setScreen('Graficas')} title='Screen Graficas y Estadisticas'/>
        <Button color="#2AA63E" onPress={()=>setScreen('Mes')} title='Screen Presupuestos Mensuales'/>
       </View>

        <Text  style={styles.texto4}>Desarrollo de Apps Moviles: </Text>
        <Text  style={styles.texto5}>Entregable Ahorra+App </Text>
        <Text  style={styles.texto6}>Equipo: </Text>
        <Text  style={styles.textoNombres}>Gabriel Valencia Olvera</Text>
        <Text  style={styles.textoNombres}>Santiago Antonio Meneses Rangel</Text>
        <Text  style={styles.textoNombres}>Selene Guadalupe Lira Perez</Text>
        <Text  style={styles.textoNombres}>Israel Esau Rico Ramirez </Text>

       </View>
       </View>
    )
       

    }
  
   
}


const styles = StyleSheet.create({
container2: {
    flex: 1,
    backgroundColor: '#d6fae8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },

contenedorBotones2:{
    marginTop:10,
    
    gap:15


  },
    texto2:{

   color:'#2a9752ff',
    fontSize:25,
    fontFamily: 'Arial',
    fontWeight:'bold',
    textDecorationLine:'underline',
    marginBottom: 15,
  },
  texto3:{

   color:'#000000ff',
    fontSize:20,
    fontFamily: 'Arial',
    fontWeight:'bold',
    marginBottom: 10,
   
  },
  texto4:{

   color:'#26441aff',
    fontSize:20,
    fontFamily: 'Arial',
    fontWeight:'bold',
    marginBottom: 50,
    margin: 25,
   
  },
    texto5:{

   color:'#2a502dff',
    fontSize:17,
    fontFamily: 'Arial',
    fontWeight:'bold',
    marginBottom: 10,

  },
    texto6:{

   color:'#000000ff',
    fontSize:15,
    fontFamily: 'Arial',
    fontWeight:'bold',
    marginBottom: 10,
   
  },
    textoNombres:{

   color:'#244222ff',
    fontSize:20,
    fontFamily: 'Arial',
    marginBottom: 1,
   
  },
  icono: {
    width: 50,
    height: 50,
  },
  iconContainer: {
    backgroundColor: '#bef3d5ff',
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
  },
    card: {
    backgroundColor: '#ffffff88',
    width: '85%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  })