import bs58 from "bs58";
import { ContractInfo, Numberu32, Schedule } from ".";
import {
  PublicKey,
  TransactionInstruction,
  Connection,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

/**
 * This function can be used to lock tokens
 * @param connection The Solana RPC connection object
 * @param programId The token vesting program ID
 * @param seedWord Seed words used to derive the vesting account
 * @param payer The fee payer of the transaction
 * @param sourceTokenOwner The owner of the source token account (i.e where locked tokens are originating from)
 * @param possibleSourceTokenPubkey The source token account (i.e where locked tokens are originating from), if null it defaults to the ATA
 * @param destinationTokenPubkey The destination token account i.e where unlocked tokens will be transfered
 * @param mintAddress The mint of the tokens being vested
 * @param schedules The array of vesting schedules
 * @returns An array of `TransactionInstruction`
 */
export async function create(
  connection: Connection,
  programId: PublicKey,
  seedWord: Buffer | Uint8Array,
  payer: PublicKey,
  sourceTokenOwner: PublicKey,
  possibleSourceTokenPubkey: PublicKey | null,
  destinationTokenPubkey: PublicKey,
  mintAddress: PublicKey,
  schedules: Array<Schedule>
): Promise<Array<TransactionInstruction>> {
  // If no source token account was given, use the associated source account
  if (possibleSourceTokenPubkey == null) {
    possibleSourceTokenPubkey = await getAssociatedTokenAddress(
      mintAddress,
      sourceTokenOwner,
      true
    );
  }

  // Find the non reversible public key for the vesting contract via the seed
  seedWord = seedWord.slice(0, 31);
  const [vestingAccountKey, bump] = await PublicKey.findProgramAddress(
    [seedWord],
    programId
  );

  const vestingTokenAccountKey = await getAssociatedTokenAddress(
    mintAddress,
    vestingAccountKey,
    true
  );

  seedWord = Buffer.from(seedWord.toString("hex") + bump.toString(16), "hex");

  console.log(
    "Vesting contract account pubkey: ",
    vestingAccountKey.toBase58()
  );

  console.log("contract ID: ", bs58.encode(seedWord));

  const check_existing = await connection.getAccountInfo(vestingAccountKey);
  if (check_existing) {
    throw "Contract already exists.";
  }

  const instruction = [
    createInitInstruction(
      SystemProgram.programId,
      programId,
      payer,
      vestingAccountKey,
      [seedWord],
      schedules.length
    ),
    createAssociatedTokenAccountInstruction(
      payer,
      vestingTokenAccountKey,
      vestingAccountKey,
      mintAddress
    ),
    createCreateInstruction(
      programId,
      TOKEN_PROGRAM_ID,
      vestingAccountKey,
      vestingTokenAccountKey,
      sourceTokenOwner,
      possibleSourceTokenPubkey,
      destinationTokenPubkey,
      mintAddress,
      schedules,
      [seedWord]
    ),
  ];
  return instruction;
}

export function createUnlockInstruction(
  vestingProgramId: PublicKey,
  tokenProgramId: PublicKey,
  clockSysvarId: PublicKey,
  vestingAccountKey: PublicKey,
  vestingTokenAccountKey: PublicKey,
  destinationTokenAccountKey: PublicKey,
  seeds: Array<Buffer | Uint8Array>
): TransactionInstruction {
  const data = Buffer.concat([
    Buffer.from(Int8Array.from([2]).buffer),
    Buffer.concat(seeds),
  ]);

  const keys = [
    {
      pubkey: tokenProgramId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: clockSysvarId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: vestingAccountKey,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: vestingTokenAccountKey,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: destinationTokenAccountKey,
      isSigner: false,
      isWritable: true,
    },
  ];
  return new TransactionInstruction({
    keys,
    programId: vestingProgramId,
    data,
  });
}

export function createInitInstruction(
  systemProgramId: PublicKey,
  vestingProgramId: PublicKey,
  payerKey: PublicKey,
  vestingAccountKey: PublicKey,
  seeds: Array<Buffer | Uint8Array>,
  numberOfSchedules: number
): TransactionInstruction {
  const buffers = [
    Buffer.from(Int8Array.from([0]).buffer),
    Buffer.concat(seeds),
    new Numberu32(numberOfSchedules).toBuffer(),
  ];

  const data = Buffer.concat(buffers);
  const keys = [
    {
      pubkey: systemProgramId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: payerKey,
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: vestingAccountKey,
      isSigner: false,
      isWritable: true,
    },
  ];

  return new TransactionInstruction({
    keys,
    programId: vestingProgramId,
    data,
  });
}

export function createCreateInstruction(
  vestingProgramId: PublicKey,
  tokenProgramId: PublicKey,
  vestingAccountKey: PublicKey,
  vestingTokenAccountKey: PublicKey,
  sourceTokenAccountOwnerKey: PublicKey,
  sourceTokenAccountKey: PublicKey,
  destinationTokenAccountKey: PublicKey,
  mintAddress: PublicKey,
  schedules: Array<Schedule>,
  seeds: Array<Buffer | Uint8Array>
): TransactionInstruction {
  const buffers = [
    Buffer.from(Int8Array.from([1]).buffer),
    Buffer.concat(seeds),
    mintAddress.toBuffer(),
    destinationTokenAccountKey.toBuffer(),
  ];

  schedules.forEach((s) => {
    buffers.push(s.toBuffer());
  });

  const data = Buffer.concat(buffers);
  const keys = [
    {
      pubkey: tokenProgramId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: vestingAccountKey,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: vestingTokenAccountKey,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: sourceTokenAccountOwnerKey,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: sourceTokenAccountKey,
      isSigner: false,
      isWritable: true,
    },
  ];
  return new TransactionInstruction({
    keys,
    programId: vestingProgramId,
    data,
  });
}

export const generateRandomSeed = () => {
  // Generate a random seed
  let seed = "";
  for (let i = 0; i < 64; i++) {
    seed += Math.floor(Math.random() * 10);
  }
  return seed;
};

export async function getContractInfo(
  connection: Connection,
  vestingAccountKey: PublicKey
): Promise<ContractInfo> {
  console.log("Fetching contract ", vestingAccountKey.toBase58());
  const vestingInfo = await connection.getAccountInfo(
    vestingAccountKey,
    "single"
  );
  if (!vestingInfo) {
    throw new Error("Vesting contract account is unavailable");
  }
  const info = ContractInfo.fromBuffer(vestingInfo!.data);
  if (!info) {
    throw new Error("Vesting contract account is not initialized");
  }
  return info!;
}
