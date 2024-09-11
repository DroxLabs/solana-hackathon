"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { NETWORK_ENUM } from "../constant/network";

type NetworkType = NETWORK_ENUM | null;
interface NetworkContextType {
  network: NETWORK_ENUM;
  setNetwork: () => void;
  resetNetwork: () => void;
}

const defaultValue: NetworkContextType = {
  network: NETWORK_ENUM.devnet,
  setNetwork: () => void {},
  resetNetwork: () => void {},
};

const NetworkContext = createContext<NetworkContextType>(defaultValue);

interface Props {
  children: ReactNode;
}

export const NetworkProvider: React.FC<Props> = ({ children }) => {
  const [network, setNetwork] = useState<NetworkType>(null);

  const persistedNetwork = useMemo(
    () => localStorage.getItem("network"),
    []
  ) as NetworkType;

  useEffect(() => {
    setNetwork(persistedNetwork);
  }, [persistedNetwork]);

  useEffect(() => {
    savePersitedNetwork(network);
  }, [network]);

  const savePersitedNetwork = (network?: NetworkType) => {
    if (network) localStorage.setItem("network", network);
  };

  const resetNetwork = () => {
    localStorage.removeItem("network");
  };

  return (
    <NetworkContext.Provider
      value={{
        network: network ?? NETWORK_ENUM.devnet,
        setNetwork: () => {},
        resetNetwork: resetNetwork,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useValue must be used within a ValueProvider");
  }
  return context;
};
