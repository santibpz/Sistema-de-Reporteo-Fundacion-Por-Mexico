import React, { useState, createContext, useContext } from 'react';

// Crear un contexto para el estado compartido
const DisableColorsContext = createContext();

export const DisableColorsProvider = ({ children }) => {
  const [disableColors, setDisableColors] = useState(false);

  const toggleDisableColors = () => {
    setDisableColors(!disableColors);
  };

  return (
    <DisableColorsContext.Provider value={{ disableColors, toggleDisableColors }}>
      {children}
    </DisableColorsContext.Provider>
  );
};

export const useDisableColors = () => {
  return useContext(DisableColorsContext);
};