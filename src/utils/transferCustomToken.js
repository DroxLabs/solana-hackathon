// import { Connection, Transaction, PublicKey } from '@solana/web3.js';
// import { createTransferInstruction, TOKEN_PROGRAM_ID, getAccount, getMint, transfer } from '@solana/spl-token';

// export async function transferCustomToken(provider, connection, amount, fromTokenAccountPubkey, toTokenAccountPubkey) {
//   const payer = provider.publicKey;
//   const payerSecretKey = provider.secretKey;

//   // Load the token accounts
//   const fromTokenAccount = await getAccount(connection, fromTokenAccountPubkey);
//   const toTokenAccount = await getAccount(connection, toTokenAccountPubkey);

//   // Load the mint associated with the token accounts
//   const mint = await getMint(connection, fromTokenAccount.mint);

//   // Create the transaction
//   const transaction = new Transaction().add(
//     createTransferInstruction(
//       fromTokenAccountPubkey,
//       toTokenAccountPubkey,
//       payer,
//       amount,
//       [],
//       TOKEN_PROGRAM_ID
//     )
//   );

//   // Sign and send the transaction
//   const signature = await connection.sendTransaction(transaction, [payerSecretKey], {
//     skipPreflight: false,
//     preflightCommitment: 'confirmed',
//   });

//   await connection.confirmTransaction(signature, 'confirmed');

//   return {
//     signature,
//   };
// }
