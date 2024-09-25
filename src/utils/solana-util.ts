import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import * as spl from "@solana/spl-token";
import * as Web3 from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { RecipientAddressType } from "../components/multisend-form/type";
import * as anchor from "@coral-xyz/anchor";
import { TransactionInstruction } from "@solana/web3.js";

export const getTokenDecimal = async (
  tokenAddress: string,
  connection: Connection
) => {
  try {
    //   const connection = new Connection(Web3.clusterApiUrl(network), "confirmed");

    let mint = new PublicKey(tokenAddress);
    const mintInfo = await spl.getMint(connection, mint);

    let decimals = mintInfo.decimals;
    //   console.log("mint address ", mint.toBase58());
    return decimals;
  } catch (error) {
    console.error("Error fetching token decimals", error);
    return null;
  }
};

export const isValidAccountAddress = (address: string) => {
  try {
    const RAY_MINT = new PublicKey(address);
    return PublicKey.isOnCurve(new PublicKey(RAY_MINT));
  } catch (error) {
    return false;
  }
};

export function parseAddresses(input: string): {
  recipients: RecipientAddressType[];
  errors: string[];
} {
  const lines = input.trim().split("\n");
  const recipients: RecipientAddressType[] = [];
  const errors: string[] = [];

  lines.forEach((line, index) => {
    const parts = line.split(",");

    if (parts.length !== 2) {
      errors.push(
        `Error on line ${index + 1}: Incorrect format, expected 2 values.`
      );
      return;
    }

    const [address, amount] = parts.map((part) => part.trim());

    if (!isValidAccountAddress(address)) {
      errors.push(`Error on line ${index + 1}: Invalid address format.`);
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      errors.push(
        `Error on line ${
          index + 1
        }: Invalid amount format, expected a positive number.`
      );
      return;
    }

    recipients.push({ address, amount });
  });

  return { recipients, errors };
}

export const allAddressAvailable = async (
  connection: Connection,
  users: Keypair[],
  mint: PublicKey,
  myAddress: Web3.PublicKey
): Promise<PublicKey[]> => {
  const userATAs: PublicKey[] = [];
  const batchSize = 11; //only allows 11 accounts to batch

  for (let i = 0; i < users.length; i += batchSize) {
    const instructions: anchor.web3.TransactionInstruction[] = [];

    for (let j = i; j < i + batchSize && j < users.length; j++) {
      const user = users[j];

      const userATA = await spl.getAssociatedTokenAddress(
        mint,
        user.publicKey,
        false,
        spl.TOKEN_PROGRAM_ID,
        spl.ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const ataInfo = await connection.getAccountInfo(userATA);

      if (!ataInfo) {
        const createATAInstruction =
          spl.createAssociatedTokenAccountInstruction(
            myAddress,
            userATA,
            user.publicKey,
            mint,
            spl.TOKEN_PROGRAM_ID,
            spl.ASSOCIATED_TOKEN_PROGRAM_ID
          );

        instructions.push(createATAInstruction);

        console.log(
          `peparing to create ATA ${userATA.toBase58()} for user: ${user.publicKey.toBase58()}`
        );
      }

      userATAs.push(userATA);
    }

    if (instructions.length > 0) {
      // const tx = new anchor.web3.Transaction().add(...instructions);
      // await Web3.sendAndConfirmTransaction(connection, tx, [keypair], {
      //   commitment: "confirmed",
      // });
      // console.log(
      //   `batch transaction sent with ${instructions.length} ATA creation(s).`
      // );
    } else {
      console.log("no ATAs needed to be created, all exist already.");
    }
  }

  return userATAs;
};

export const chunkArray = (array: Array<any>, chunkSize: number) => {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

// const calculateTransactionSize = (
//   instructions: [Web3.TransactionInstruction]
// ) => {
//   let size = 0;
//   // Fixed size of metadata (blockhash + feePayer + signatures)
//   size += 64; // blockhash
//   size += 64; // feePayer (1 signature)

//   // Loop through each instruction to add its size
//   instructions.forEach((instruction) => {
//     size += 4; // Size of programId (32 bytes, stored as 4 bytes in transaction)
//     size += 32 * instruction.keys.length; // Size of each account in keys (32 bytes per account)
//     size += instruction.data.length; // Size of instruction data (varies by instruction)
//   });

//   return size;
// };

// export const chunkInstructionsBySize = (
//   instructions: Web3.TransactionInstruction[],
//   maxSize = 1232
// ) => {
//   const batches = [];
//   let currentBatch = [];
//   let currentSize = 0;

//   for (const instruction of instructions) {
//     const estimatedSize = calculateTransactionSize([instruction]);

//     if (currentSize + estimatedSize > maxSize) {
//       // If the current batch size exceeds the max size, push it to batches and start a new batch
//       batches.push(currentBatch);
//       currentBatch = [];
//       currentSize = 0;
//     }

//     currentBatch.push(instruction);
//     currentSize += estimatedSize;
//   }

//   if (currentBatch.length > 0) {
//     batches.push(currentBatch);
//   }

//   return batches;
// };

const calculateInstructionSize = (
  instruction: TransactionInstruction
): number => {
  // Calculate the size of the keys, programId, and data
  const keySize = instruction.keys.length * 32; // Each public key is 32 bytes
  const programIdSize = instruction.programId.toBuffer().length; // Program ID is 32 bytes
  const dataSize = instruction.data.length; // Data size in bytes
  console.log("instructionBatches :", {
    instruction,
    size: keySize + programIdSize + dataSize,
  });

  // Calculate total size for this instruction
  return keySize + programIdSize + dataSize;
};

const MAX_TRANSACTION_SIZE = 1232; // Approximate max size for a Solana transaction

export const batchInstructionsBySize = (
  instructions: TransactionInstruction[],
  feePayer: PublicKey,
  blockhash: string
): TransactionInstruction[][] => {
  const batches: TransactionInstruction[][] = [];
  let currentBatch: TransactionInstruction[] = [];
  let currentBatchSize = 0;

  for (const instruction of instructions) {
    const transferTx = new Web3.Transaction();
    // Add the instruction to the current batch
    currentBatch.push(instruction);
    console.log("instructionBatches", ...currentBatch);
    transferTx.add(...currentBatch);

    console.log("transferTx instructionBatches:", transferTx, currentBatchSize);
    const transactionSize = getTxSize(transferTx, feePayer);
    console.log("instructionSize instructionBatches:", transactionSize);

    // Check if adding this instruction would exceed the transaction size limit
    if (transactionSize > MAX_TRANSACTION_SIZE) {
      console.log("transactionSize instructionBatches:", transactionSize);
      // If yes, push the current batch and start a new one
      currentBatch.pop();
      batches.push(currentBatch);
      currentBatch = [instruction];
      currentBatch = [];
      currentBatchSize = 0;
    } else {
      currentBatchSize = transactionSize;
    }
  }

  // Push the last batch if not empty
  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  return batches;
};

/**
 * @param tx a solana transaction
 * @param feePayer the publicKey of the signer
 * @returns size in bytes of the transaction
 */
export const getTxSize = (
  tx: Web3.Transaction,
  feePayer: PublicKey
): number => {
  const feePayerPk = [feePayer.toBase58()];

  const signers = new Set<string>(feePayerPk);
  const accounts = new Set<string>(feePayerPk);

  const ixsSize = tx.instructions.reduce((acc, ix) => {
    ix.keys.forEach(({ pubkey, isSigner }) => {
      const pk = pubkey.toBase58();
      if (isSigner) signers.add(pk);
      accounts.add(pk);
    });

    accounts.add(ix.programId.toBase58());

    const nIndexes = ix.keys.length;
    const opaqueData = ix.data.length;

    return (
      acc +
      1 + // PID index
      compactArraySize(nIndexes, 1) +
      compactArraySize(opaqueData, 1)
    );
  }, 0);

  return (
    compactArraySize(signers.size, 64) + // signatures
    3 + // header
    compactArraySize(accounts.size, 32) + // accounts
    32 + // blockhash
    compactHeader(tx.instructions.length) + // instructions
    ixsSize
  );
};

// COMPACT ARRAY

const LOW_VALUE = 127; // 0x7f
const HIGH_VALUE = 16383; // 0x3fff

/**
 * Compact u16 array header size
 * @param n elements in the compact array
 * @returns size in bytes of array header
 */
const compactHeader = (n: number) =>
  n <= LOW_VALUE ? 1 : n <= HIGH_VALUE ? 2 : 3;

/**
 * Compact u16 array size
 * @param n elements in the compact array
 * @param size bytes per each element
 * @returns size in bytes of array
 */
const compactArraySize = (n: number, size: number) =>
  compactHeader(n) + n * size;
