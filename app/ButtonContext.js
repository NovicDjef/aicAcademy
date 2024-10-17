import React, { createContext, useState, useContext } from 'react';

const ButtonContext = createContext();

export function ButtonProvider({ children }) {
  const [showButton, setShowButton] = useState(true);

  return (
    <ButtonContext.Provider value={{ showButton, setShowButton }}>
      {children}
    </ButtonContext.Provider>
  );
}

export function useButtonContext() {
  return useContext(ButtonContext);
}