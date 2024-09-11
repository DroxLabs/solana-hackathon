import { mintTokenToAssociatedAccount, signAndSendTransaction } from "./signAndSendTransaction";
import {createAssociateAccountFromMintKey} from './createAssociateAccountFromMintKey'
import * as spl from '@solana/spl-token';
import * as anchor from "@coral-xyz/anchor";
import {PublicKey, SystemProgram, Transaction,sendAndConfirmTransaction,Keypair} from '@solana/web3.js';
import * as Web3 from '@solana/web3.js'
import base58 from 'bs58'; 
const { ComputeBudgetProgram } = require('@solana/web3.js');


// NO WALLET INTERACTICVE TXs

export const mintTokenToUserATAs = async (connection, provider, mintPubkey, ownerPubkey, associatedTokenPubkey, tokensToMint,payerKeypair) => {
    console.log("hammad here")
let txSignautre =await transferSplTokens(connection,provider,provider,mintPubkey,1,payerKeypair);
   return {
       status: true,
       transactionSignature: txSignautre
   }
}

const createBeneficiarAndATA = async (provider, mint) => {
    const beneficiar = Keypair.generate();
    
    let beneficiarATA = await spl.getAssociatedTokenAddress(
        mint,
        beneficiar.publicKey,
        false,
        spl.TOKEN_PROGRAM_ID,
        spl.ASSOCIATED_TOKEN_PROGRAM_ID
    );
 console.log("ATA",beneficiarATA.toBase58())
    return [beneficiar, beneficiarATA];
};
const PRIVATE_KEY ='47JW6RWKyBqMfBocBbUfV4xWHojdgc9bUX1XHX4yJU2MQtuW83LNmyiHQVjQwCDekezNhBk7i4FUoNshWfxgKss9';
const privateKey =new Uint8Array(base58.decode(PRIVATE_KEY));

const account = Web3.Keypair.fromSecretKey(privateKey);

const transferSplTokens = async (connection,provider, payer, mint, amount,payerKeypair) => {
    // const newAccountPublicKey = new PublicKey("BFBhYjrmqH2qFE7PuR7ftaWRvT19YnDLiWvShmRicPaG");
const payerAta = await spl.getOrCreateAssociatedTokenAccount(
    connection,
    payerKeypair,
    mint,
    payerKeypair.publicKey,
    
);
console.log(payerAta.address.toBase58());
let users=[];
let userATAs=[];
let userInfos=[];
let userATAsInfos=[]
for(let i=0;i<10;i++){
  let [user,userATA] = await createBeneficiarAndATA(provider,mint);
  users.push(user);
  userATAs.push(userATA);

  let userInfo = await connection.getAccountInfo(user.publicKey);
  userInfos.push(userInfo);
  let userATAInfo  = await connection.getAccountInfo(userATA);
  userATAsInfos.push(userATAInfo);
}

// console.log(user.publicKey.toBase58(),userATA.toBase58())
const transferTx = new Transaction();
users.forEach(async (user,index)=>{
  
  if(!userInfos[index]){
      transferTx.add(
        Web3.SystemProgram.transfer({
            fromPubkey: payerKeypair.publicKey,
            toPubkey: user.publicKey,
            lamports: 0.001 * anchor.web3.LAMPORTS_PER_SOL, // 0.001 SOL in lamports
        })
    );
  }
  
})

   await Web3.sendAndConfirmTransaction(
     connection,
     transferTx,
     [payerKeypair],
     {skipPreflight:false, preflightCommitment:'confirmed'}
   ).then(sig =>{
     console.log(`Explorer URL: https://explorer.solana.com/tx/${sig}?cluster=devnet`)
   })


console.log(payerKeypair.publicKey.toBase58());
const requestHeapIx = ComputeBudgetProgram.requestHeapFrame({
  bytes: 256 * 1024, // 256 KB (adjust as necessary)
});
    const txFundATA = new Transaction().add(requestHeapIx);

//     let userATAInfo = await connection.getAccountInfo(userATA);
//     // console.log(userATAInfo);
userATAs.forEach((userATA,index)=>{
  if(!userATAsInfos[index]){
    console.log(users[index].publicKey)
        txFundATA.add(
          spl.createAssociatedTokenAccountInstruction(
            payerKeypair.publicKey,
            userATA,
            users[index].publicKey,
            mint,
            spl.TOKEN_PROGRAM_ID,
            spl.ASSOCIATED_TOKEN_PROGRAM_ID
          )
        );
    txFundATA.add(
      spl.createMintToInstruction(
        mint,
        userATA,
        payerKeypair.publicKey,
        0.1 * 10 ** 9,
        // 2000000000,
        [],
        spl.TOKEN_PROGRAM_ID
      )
    );
    


  }
})
// let signature = await signAndSendTransaction(connection,txFundATA,provider,[payerKeypair])
// await connection.confirmTransaction(signature);
let signature =await Web3.sendAndConfirmTransaction(
  connection,
  txFundATA,
  [payerKeypair],
  {skipPreflight:false, preflightCommitment:'confirmed'}
)
    return signature
};

// const tx = new Transaction().add(
//     spl.createTransferInstruction(
//         payerAta.address,   // Payer's ATA
//             userATA,        // New account's ATA
//             payer.publicKey,    // Payer's public key
//             amount*10**9,             // Amount of SPL tokens to transfer
//          // SPL Token Program ID
//         )
//     );
