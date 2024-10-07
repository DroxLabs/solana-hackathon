"use client";
import { NETWORK } from "@/constants";
import { ReactNode, useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";

interface IWalletProviderProps {
  children: ReactNode;
}

function WalletProvider({ children }: Readonly<IWalletProviderProps>) {
  const endpoint = useMemo(() => clusterApiUrl(NETWORK), [NETWORK]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network: NETWORK }),
    ],
    [NETWORK]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}

export default WalletProvider;
