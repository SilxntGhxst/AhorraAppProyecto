

import React, { useEffect, useState } from 'react'; 

import { NavigationContainer } from '@react-navigation/native'; 

import RootNavigator from './navigation/AppNavigator'; 


export default function App() {
  //const [dbLoaded, setDbLoaded] = useState(false);

  //useEffect(() => {
    // Inicializar la BD
  //  initDB();
   // setDbLoaded(true); 
 // }, []);

 // if (!dbLoaded) {
  //  return null; 
  //}

 
  return (
    <NavigationContainer>
   
      <RootNavigator /> 
    </NavigationContainer>
  );
}