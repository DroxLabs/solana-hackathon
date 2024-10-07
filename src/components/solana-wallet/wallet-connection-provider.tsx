// components/WalletConnectionProvider.tsx
"use client";

import { FC, ReactNode, useMemo } from "react";
import {
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import "@solana/wallet-adapter-react-ui/styles.css"; // Optional, for wallet UI styling
import { useNetwork } from "../../context/network.context";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

const WalletConnectionProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { network } = useNetwork();

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new SolflareWalletAdapter({ network: network }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletConnectionProvider;
