"use client";

import React from "react";
import NavMenu from "./nav-menu";
import Logo from "@/components/ui/logo-ui/logo";
import WalletNetworkButton from "../solana-wallet/wallet-network-dropdown";
import { useWalletMultiButton } from "@solana/wallet-adapter-base-ui";

import {
  BaseWalletMultiButton,
  useWalletModal,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletButton } from "../solana-wallet/wallet-button";
import Link from "next/link";

const Navbar = () => {
  const { wallet, connect, connecting, connected } = useWallet();
  const { setVisible: setModalVisible } = useWalletModal();
  const {
    buttonState,
    onConnect,
    onDisconnect,
    publicKey,
    walletIcon,
    walletName,
  } = useWalletMultiButton({
    onSelectWallet() {
      setModalVisible(true);
    },
  });

  return (
    <nav className="flex flex-row justify-between px-10 py-5 text-white p-4 sticky top-0 z-10">
      <div className="flex flex-row gap-10 items-center">
        <Link href="/">
          <Logo />
        </Link>
        <NavMenu />
      </div>
      <div className="flex flex-row gap-10 items-center">
        <WalletButton
          className="bg-primary-wallet py-2.5 px-5"
          labels={{
            connecting: "Connecting...",
            "has-wallet": "Connect",
            "no-wallet": "Connect",
            "copy-address": "Copy Address",
            copied: "Copied",
            "change-wallet": "Change Wallet",
            disconnect: "Disconnect",
          }}
        />
        <WalletNetworkButton className="bg-primary-network py-2.5 px-5" />
      </div>
    </nav>
  );
};

export default Navbar;
