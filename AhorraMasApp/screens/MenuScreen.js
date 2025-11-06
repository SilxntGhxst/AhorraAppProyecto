import { Text, StyleSheet, View, Button } from 'react-native'
import React, { Component, useState } from 'react'
import IniciarSesionScreen from './IniciarSesionScreen'
import RegistrarScreen from './RegistrarScreen'
import TransactionsScreen from './TransactionsScreen'
import MonthlyBudgetsScreen from './MonthlyBudgetsScreen'



export default function MenuScreen() {

    const[screen, setScreen]=useState('menu')

    switch(screen){

        case 'IniciarSesion': 
            return <IniciarSesionScreen/>
        case'Registrar':
        return <RegistrarScreen/>
        case
     
        case 'menu':
            default:
            return (

      <View style={styles.container2}>
        
        <Text  style={styles.texto2}>Menu AhorraMasApp:</Text>
        <View style={styles.contenedorBotones2}>
       <Button color="#FFB86A" onPress={()=>setScreen('IniciarSesion')} title='Screen Iniciar sesión'/>
        <Button color="#FFB86A" onPress={()=>setScreen('Registrar')} title='Screen Registrar'/>
      

        </View>
      </View>
    )
       

    }
  
   
}


const styles = StyleSheet.create({
container2: {
    flex: 1,
    backgroundColor: '#2D9966',
    alignItems: 'center',
    justifyContent: 'center',
  },

contenedorBotones2:{
    marginTop:15,
    
    gap:15


  },
    texto2:{

   color:'#FEF9C2',
    fontSize:30,
    fontFamily: 'Time New Roman',
    fontWeight:'bold',
    fontStyle:'italic',
    textDecorationLine:'underline'


  },
  })