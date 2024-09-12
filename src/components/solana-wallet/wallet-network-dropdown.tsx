"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNetwork } from "../../context/network.context";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

const WalletNetworkButton = () => {
  const { network, setNetwork } = useNetwork();

  const networkList = [
    WalletAdapterNetwork.Devnet,
    WalletAdapterNetwork.Testnet,
    WalletAdapterNetwork.Mainnet,
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="uppercase">{network}</DropdownMenuTrigger>
      <DropdownMenuContent className="uppercase">
        <DropdownMenuLabel>Select Network</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {networkList.map((network) => (
          <DropdownMenuItem
            className="cursor-pointer"
            key={network}
            onClick={() => setNetwork(network)}
          >
            {network}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WalletNetworkButton;
