// AhorraMasApp/App.js (Modificación)

import React, { useEffect, useState } from 'react';
import MenuScreen from './screens/MenuScreen';
import { initDB } from './services/DBService'; // <-- Importacion de los servicios BD

export default function App() {
  const [dbLoaded, setDbLoaded] = useState(false);

  useEffect(() => {
    // 1. Inicializar la BD al montar el componente
    initDB();
    setDbLoaded(true); // Marcar como cargada (simulación)

    // Posible pantalla de carga aquí
  }, []);

  if (!dbLoaded) {
    // Podemos retornar una pantalla de carga simple o null
    return null; 
  }

  // 2. Retornar MenuScreen (cambiará directamente iniciar sesion o a una pantalla de bienvenida)
  return (
    <MenuScreen />
  );
}