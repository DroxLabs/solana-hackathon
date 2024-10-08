import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";
import { useCallback, useState } from "react";
import {
  RecipientAddressType,
  TokenTypeEnum,
} from "../components/multisend-form/type";
import * as spl from "@solana/spl-token";
import * as anchor from "@coral-xyz/anchor";
import { batchInstructionsBySize } from "../utils/solana-util";
import { useModal } from "../context/modal.context";
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "../components/ui/alert-dialog";
import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";

const useBatchTx = () => {
  const { publicKey, connected, signTransaction } = useWallet();
  const { connection } = useConnection();
  const { closeModal, openModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  // Dummy Data for demonstration
  //   const DUMMY_MINT_ADDRESS = "J3AijY43ro4kbuSq6b7hgELGBbD8xvtptD4JjmxDmMm8";
  //   const DEVNET_URL = "https://api.devnet.solana.com"; // or Web3.clusterApiUrl("devnet");

  // Dummy input data (to be replaced by actual user input)
  //   const recipientData: RecipientAddressType[] = [
  //     { address: "RecipientAddress1", amount: "1" },
  //     { address: "RecipientAddress2", amount: "0.5" },
  //     { address: "RecipientAddress3", amount: "2" },
  //   ];

  const ModalBody = (
    modalData: Array<{ signature: string; blockhash: string }>
  ) => {
    const copySignature = (signature: string) => {
      navigator.clipboard.writeText(signature).then(
        () => {
          alert("Signature copied to clipboard!");
        },
        (err) => {
          console.error("Failed to copy text: ", err);
        }
      );
    };

    return (
      <>
        <AlertDialogHeader
          className="overflow-hidden"
          style={{ overflow: "auto !important" }}
        >
          <AlertDialogTitle className="text-gray-400">
            Review Transactions
          </AlertDialogTitle>
          {modalData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <AlertDialogDescription className="text-gray-200 h-full truncate w-fit">
                Signature: {item.signature}
              </AlertDialogDescription>
              <button onClick={() => copySignature(item.signature)}>
                Copy
              </button>
            </div>
          ))}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeModal}>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </>
    );
  };

  const findOrCreateATAAndTransfer = async ({
    recipients,
    mint,
    ownerATA,
    decimals,
    publicKey,
  }: {
    recipients: RecipientAddressType[];
    mint: PublicKey;
    ownerATA: PublicKey;
    decimals: number;
    publicKey: PublicKey;
  }) => {
    const instructions: TransactionInstruction[] = [];
    const userATAs: PublicKey[] = [];

    for (const recipient of recipients) {
      const userPublicKey = new PublicKey(recipient.address);
      const amountToTransfer = Number(recipient.amount) * 10 ** decimals; // Convert amount to the correct format based on decimals

      // Get the recipient's associated token address (ATA)
      const userATA = await spl.getAssociatedTokenAddress(
        mint,
        userPublicKey,
        false,
        spl.TOKEN_PROGRAM_ID,
        spl.ASSOCIATED_TOKEN_PROGRAM_ID
      );

      // Check if the account exists
      const ataInfo = await connection.getAccountInfo(userATA);

      // If the ATA does not exist, create it
      if (!ataInfo) {
        const createATAInstruction =
          spl.createAssociatedTokenAccountInstruction(
            publicKey, // fee payer (transaction initiator)
            userATA, // ATA address for recipient
            userPublicKey, // recipient's public key
            mint, // mint address
            spl.TOKEN_PROGRAM_ID,
            spl.ASSOCIATED_TOKEN_PROGRAM_ID
          );

        instructions.push(createATAInstruction); // Add ATA creation instruction to the batch
      }

      // Add the transfer instruction
      const transferInstruction = spl.createTransferInstruction(
        ownerATA, // Source ATA (the owner’s token account)
        userATA, // Destination ATA (the recipient’s token account)
        publicKey, // Owner of the source ATA (signer)
        amountToTransfer, // Amount to transfer (in tokens)
        [],
        spl.TOKEN_PROGRAM_ID
      );

      instructions.push(transferInstruction); // Add transfer instruction to the batch
      userATAs.push(userATA); // Keep track of user ATA addresses
    }

    return { instructions, userATAs }; // Return all instructions in one go
  };

  const createAndTransferBatch = useCallback(
    async ({
      recipients,
      mintAddress,
      tokenType = TokenTypeEnum.SOL,
    }: {
      recipients: RecipientAddressType[];
      mintAddress: string;
      tokenType?: TokenTypeEnum | null;
    }) => {
      if (!connected || !publicKey || !signTransaction) {
        throw new WalletNotConnectedError();
      }

      try {
        setIsLoading(true);
        closeModal();
        let instructions: Array<TransactionInstruction> = [];
        // Fetch mint information
        if (tokenType !== TokenTypeEnum.SOL) {
          const mint = new PublicKey(mintAddress);

          // Fetch mint information
          const mintInfo = await spl.getMint(connection, mint);
          const decimals = mintInfo.decimals;
          const ownerATA = await spl.getAssociatedTokenAddress(
            mint,
            publicKey,
            false,
            spl.TOKEN_PROGRAM_ID,
            spl.ASSOCIATED_TOKEN_PROGRAM_ID
          );

          // Get combined ATA creation and transfer instructions for all recipients
          const result = await findOrCreateATAAndTransfer({
            recipients,
            mint,
            ownerATA,
            decimals,
            publicKey,
          });
          instructions = result.instructions;
        } else {
          // If transferring SOL tokens
          recipients.forEach((recipient) => {
            const transferInstruction = anchor.web3.SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: new PublicKey(recipient.address),
              lamports: Number(recipient.amount) * LAMPORTS_PER_SOL, // Amount of SOL in lamports
            });
            instructions.push(transferInstruction);
          });
        }

        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash();
        const instructionBatches = batchInstructionsBySize(
          instructions,
          publicKey
        );
        // const instructionBatches = chunkArray(instructions, 22);

        const txDetails = [];
        for (const batch of instructionBatches) {
          // Create a new transaction with the batch of instructions
          const transferTx = new anchor.web3.Transaction();
          transferTx.add(...batch);
          transferTx.feePayer = publicKey;
          transferTx.recentBlockhash = blockhash;

          // Sign the transaction
          const signedTransaction = await signTransaction(transferTx);

          // Send the transaction
          const signature = await connection.sendRawTransaction(
            signedTransaction.serialize(),
            {
              skipPreflight: false,
              preflightCommitment: "confirmed",
            }
          );

          await connection.confirmTransaction(
            {
              signature: signature,
              blockhash: blockhash,
              lastValidBlockHeight: lastValidBlockHeight,
            },
            "confirmed"
          );
          // Confirm the transaction
          //   await connection.confirmTransaction(signature, "confirmed");
          txDetails.push({ signature, blockhash });
        }

        openModal({
          modalType: "TransactionDetails",
          modalNodeData: ModalBody(txDetails),
        });
        setIsLoading(false);

        return txDetails;
      } catch (error) {
        setIsLoading(false);
        console.error("Transaction failed: instructionBatches", error);
      }
    },
    [publicKey, connected, signTransaction, connection]
  );

  return { createAndTransferBatch, findOrCreateATAAndTransfer, isLoading };
};

export default useBatchTx;
