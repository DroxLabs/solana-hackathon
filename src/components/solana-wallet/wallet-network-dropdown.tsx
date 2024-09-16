"use client";

import React, { useState } from "react";
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
import BorderWrapper from "../ui/button/border-wrapper";

interface WalletNetworkProps {
  className?: string;
}

// SVG for Down and Up Arrow
const DownArrow = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const UpArrow = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M18 15l-6-6-6 6" />
  </svg>
);

const WalletNetworkButton = ({ className }: WalletNetworkProps) => {
  const { network, setNetwork } = useNetwork();
  const [isOpen, setIsOpen] = useState(false);

  const networkList = [
    WalletAdapterNetwork.Devnet,
    WalletAdapterNetwork.Testnet,
    WalletAdapterNetwork.Mainnet,
  ];

  return (
    <DropdownMenu onOpenChange={(props) => setIsOpen(!isOpen)} open={isOpen}>
      <BorderWrapper
        outerColorClass="bg-[rgb(10,62,80)] hidden lg:block"
        innerColorClass="bg-[rgb(10,62,80)] hidden lg:block"
        borderColorClass="border-[rgb(10,62,80)] hidden lg:block"
      >
        <DropdownMenuTrigger
          className={`uppercase ${className} select-none flex items-center`}
        >
          {network}
          <span
            className={`v-arrow transition-transform duration-300 ml-3 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </DropdownMenuTrigger>
      </BorderWrapper>

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
