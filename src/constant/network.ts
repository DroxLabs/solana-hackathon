import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export enum NETWORK_ENUM {
  "devnet" = WalletAdapterNetwork.Devnet,
  "testnet" = WalletAdapterNetwork.Testnet,
  "mainnet-beta" = WalletAdapterNetwork.Mainnet,
}
