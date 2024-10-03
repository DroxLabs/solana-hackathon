"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BACK_ICON from "@/assets/icons/back.webp";
import { Container } from "@/components/templates";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletModalButton,
} from "@solana/wallet-adapter-react-ui";

/**
 * Header component for the app.
 *
 * This component renders the header section of the app, which includes:
 * - A back button (represented by an icon)
 * - Wallet connection controls
 *
 * The header adapts its display based on the wallet connection state:
 * - When disconnected: Shows a "Connect Wallet" button
 * - When connecting: Shows a "Connecting" button
 * - When connected: Shows a "Disconnect" button with a truncated public key
 *
 */
export default function Header() {
  const router = useRouter();
  const { connected, connecting, publicKey } = useWallet();

  useEffect(() => {}, [publicKey]);

  return (
    <Container className="__header__ flex justify-between items-center py-4">
      <Image
        src={BACK_ICON}
        alt=""
        loading="lazy"
        className="w-[41px] h-[41px] cursor-pointer"
        onClick={() => router.back()}
      />
      <div>
        {(connecting && <WalletModalButton>Connecting</WalletModalButton>) ||
          (connected && (
            <WalletDisconnectButton>
              {publicKey?.toBase58().slice(0, 5)}..
              {publicKey?.toBase58()?.slice(-5)}
            </WalletDisconnectButton>
          )) || <WalletModalButton />}
      </div>
    </Container>
  );
}
