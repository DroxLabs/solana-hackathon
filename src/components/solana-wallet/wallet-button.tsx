"use client";

import { useWalletMultiButton } from "@solana/wallet-adapter-base-ui";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import React, {
  CSSProperties,
  MouseEvent,
  PropsWithChildren,
  ReactElement,
  useMemo,
  useState,
} from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BorderWrapper from "../ui/button/border-wrapper";

export type ButtonProps = PropsWithChildren<{
  className?: string;
  disabled?: boolean;
  endIcon?: ReactElement;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  startIcon?: ReactElement;
  style?: CSSProperties;
  tabIndex?: number;
}>;

type Props = ButtonProps & {
  labels: Omit<
    {
      [TButtonState in ReturnType<
        typeof useWalletMultiButton
      >["buttonState"]]: string;
    },
    "connected" | "disconnecting"
  > & {
    "copy-address": string;
    copied: string;
    "change-wallet": string;
    disconnect: string;
  };
};

export function WalletButton({ children, labels, ...props }: Props) {
  const { setVisible: setModalVisible } = useWalletModal();
  const { buttonState, onConnect, onDisconnect, publicKey } =
    useWalletMultiButton({
      onSelectWallet() {
        setModalVisible(true);
      },
    });
  const [copied, setCopied] = useState(false);

  const content = useMemo(() => {
    if (children) {
      return children;
    } else if (publicKey) {
      const base58 = publicKey.toBase58();
      return base58.slice(0, 4) + ".." + base58.slice(-4);
    } else if (buttonState === "connecting" || buttonState === "has-wallet") {
      return labels[buttonState];
    } else {
      return labels["no-wallet"];
    }
  }, [buttonState, children, labels, publicKey]);
  return (
    <div className="wallet-adapter-dropdown">
      <DropdownMenu>
        <BorderWrapper>
          <DropdownMenuTrigger
            {...props}
            onClick={() => {
              switch (buttonState) {
                case "no-wallet":
                  setModalVisible(true);
                  break;
                case "has-wallet":
                  if (onConnect) {
                    onConnect();
                  }
                  break;
                case "connected":
                  break;
              }
            }}
          >
            {content}
          </DropdownMenuTrigger>
        </BorderWrapper>

        {buttonState !== "no-wallet" && (
          <DropdownMenuContent className="uppercase text-gray-800">
            <DropdownMenuLabel>Wallet Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {publicKey ? (
              <DropdownMenuItem
                onClick={async () => {
                  await navigator.clipboard.writeText(publicKey.toBase58());
                  setCopied(true);
                  setTimeout(() => setCopied(false), 400);
                }}
                role="menuitem"
              >
                {copied ? labels["copied"] : labels["copy-address"]}
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem
              onClick={() => {
                setModalVisible(true);
              }}
              role="menuitem"
            >
              {labels["change-wallet"]}
            </DropdownMenuItem>
            {onDisconnect ? (
              <DropdownMenuItem
                onClick={() => {
                  onDisconnect();
                }}
                role="menuitem"
              >
                {labels["disconnect"]}
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
}
