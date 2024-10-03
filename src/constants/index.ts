export const ONE_TRANSFER_SIZE: number = 56;

export const ONE_CREATE_ACCOUNT_SIZE: number = 52;

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

/** Solana Network */
export const NETWORK = WalletAdapterNetwork.Devnet;

/** Solana Connection */
export const CONNECTION = new Connection(clusterApiUrl(NETWORK), "confirmed");

/** Smart contract ID */
export const TOKEN_VESTING_PROGRAM_ID = new PublicKey(
  "DLxB9dSQtA4WJ49hWFhxqiQkD9v6m67Yfk9voxpxrBs4"
);

/** Amount to give per schedule */
export const DECIMALS = 9;

/** Amount to give per schedule */
export const AMOUNT_PER_SCHEDULE = 2;

/** Private Key */
export const PRIVATE_KEY = [
  127, 253, 219, 115, 254, 61, 77, 239, 211, 135, 192, 103, 17, 23, 177, 235,
  203, 61, 227, 196, 210, 16, 255, 133, 60, 123, 80, 73, 7, 60, 145, 192, 72,
  33, 79, 60, 79, 69, 87, 221, 242, 71, 63, 203, 181, 64, 169, 188, 181, 200,
  114, 220, 66, 40, 186, 141, 91, 110, 173, 4, 0, 187, 230, 55,
];

export * from "./enum";
