"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

interface NetworkContextType {
  network: WalletAdapterNetwork;
  setNetwork: (network: WalletAdapterNetwork) => void;
  resetNetwork: () => void;
}

const defaultValue: NetworkContextType = {
  network: WalletAdapterNetwork.Devnet,
  setNetwork: (network: WalletAdapterNetwork) => {},
  resetNetwork: () => void {},
};

const NetworkContext = createContext<NetworkContextType>(defaultValue);

interface Props {
  children: ReactNode;
}

export const NetworkProvider: React.FC<Props> = ({ children }) => {
  const [network, setNetwork] = useState<WalletAdapterNetwork | null>(null);

  const isClient = useMemo(() => typeof window !== "undefined", []);

  const persistedNetwork = useMemo(() => {
    if (isClient) {
      const storedNetwork = localStorage.getItem("network");
      return storedNetwork
        ? (storedNetwork as WalletAdapterNetwork)
        : WalletAdapterNetwork.Testnet;
    }
    return null;
  }, [isClient]) as WalletAdapterNetwork;

  useEffect(() => {
    setNetwork(persistedNetwork);
  }, [persistedNetwork]);

  useEffect(() => {
    if (network) {
      savePersitedNetwork(network);
    }
  }, [network]);

  const savePersitedNetwork = (network?: WalletAdapterNetwork) => {
    if (network) localStorage.setItem("network", network);
  };

  const resetNetwork = () => {
    localStorage.removeItem("network");
  };

  return (
    <NetworkContext.Provider
      value={{
        network: network ?? WalletAdapterNetwork.Devnet,
        setNetwork,
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
