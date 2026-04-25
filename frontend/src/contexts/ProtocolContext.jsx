import { createContext, useContext } from "react";

const ProtocolContext = createContext();

export const ProtocolProvider = ({ children, value }) => (
  <ProtocolContext.Provider value={value}>{children}</ProtocolContext.Provider>
);

// eslint-disable-next-line react-refresh/only-export-components
export const useProtocolData = () => useContext(ProtocolContext);
