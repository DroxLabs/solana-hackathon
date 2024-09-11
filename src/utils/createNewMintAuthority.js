// import { Keypair, Connection, Transaction, SystemProgram } from '@solana/web3.js';
// import { createMint, createAccount, mintTo, TOKEN_PROGRAM_ID } from '@solana/spl-token';

// export async function createNewMintAuthority(provider, decimals, connection) {
//   const payer = provider.publicKey;
//   const payerSecretKey = provider.secretKey;

//   // Generate a new keypair for the mint authority
//   const mintAuthority = Keypair.generate();

//   // Create a new mint
//   const mint = await createMint(connection, payerSecretKey, mintAuthority.publicKey, null, decimals);

//   return {
//     mintAccount: mint,
//     mintAuthority: mintAuthority.publicKey
//   };
// }
