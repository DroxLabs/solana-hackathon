require('dotenv').config();

import { Keypair, Connection, SystemProgram, Transaction } from  "@solana/web3.js";
import * as Fs from 'fs';
import bs58 from "bs58";
import * as Web3 from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import * as spl from '@solana/spl-token';
import * as anchor from "@coral-xyz/anchor";


const decodedKey = new Uint8Array(
    JSON.parse(Fs.readFileSync("/home/muhammad/wallet/keypair1.json").toString()) as number[]
);
const keypair = Keypair.fromSecretKey(decodedKey);
console.log("User PublicKey:", keypair.publicKey.toBase58());

const findOrCreateATA = async (
    connection: Connection,
    users: Keypair[],
    mint: PublicKey
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
          const createATAInstruction = spl.createAssociatedTokenAccountInstruction(
            keypair.publicKey,
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
        const tx = new anchor.web3.Transaction().add(...instructions);
  
        await Web3.sendAndConfirmTransaction(connection, tx, [keypair], {
          commitment: "confirmed",
        });
  
        console.log(`batch transaction sent with ${instructions.length} ATA creation(s).`);
      } else {
        console.log("no ATAs needed to be created, all exist already.");
      }
    }
  
    return userATAs;
  };
  
  const getATAForMint = async (
    connection: Connection,
    user: PublicKey,
    mint: PublicKey
  ): Promise<PublicKey> => {
    const userATA = await spl.getAssociatedTokenAddress(
      mint,
      user,
      false,
      spl.TOKEN_PROGRAM_ID,
      spl.ASSOCIATED_TOKEN_PROGRAM_ID
    );
     
      return userATA;
   
  };
async function main() {
    // const connection = new Connection("https://api.mainnet-beta.solana.com", 'confirmed');
    const connection = new Connection(Web3.clusterApiUrl('devnet'), 'confirmed');

//1 spl token  = 10^9 or 10

    const to = Keypair.generate();
    console.log("Recipient PublicKey:", to.publicKey.toBase58());

    const { blockhash } = await connection.getLatestBlockhash();
   
    
    // let [mint,ownerata] =  await createMint(connection,supply,decimals,false,false);//make to prevent from freeze and mintAuthority make these true
    let mint = new PublicKey("J3AijY43ro4kbuSq6b7hgELGBbD8xvtptD4JjmxDmMm8")
    const mintInfo = await  spl.getMint(connection,mint);

    console.log("Mint decimal",mintInfo.decimals);
    let decimals =mintInfo.decimals;
    console.log("mint address ",mint.toBase58());
   let ownerata =  await getATAForMint(connection,keypair.publicKey,mint);

let users=[];
for (let i=0;i<22;i++){
   users.push(Keypair.generate());
}

let userATAs22=[];
userATAs22 = await findOrCreateATA(connection,users,mint);
// for(let i=0;i<22;i++){
//   let ata = await findOrCreateATA(connection,users[i],mint);
//   userATAs22.push(ata);
// }
console.log("pushed");

// console.log(userATAs22);


let instruction22 =[];
instruction22 = userATAs22.map((userATA,index)=>{
     const createTransferIx = spl.createTransferInstruction(
        ownerata,
        userATA,
        keypair.publicKey,
        1*(10**decimals),//Replace 1 by user's quantities defined
        [],
        spl.TOKEN_PROGRAM_ID
     )
     return createTransferIx;

}).flat();

const transferTx = new anchor.web3.Transaction()
transferTx.add(...instruction22);

transferTx.feePayer=keypair.publicKey;
transferTx.recentBlockhash= blockhash;
transferTx.sign(keypair);

    
        const signature = await Web3.sendAndConfirmTransaction(
            connection,
            transferTx,
            [keypair],
            { skipPreflight: false, preflightCommitment: 'confirmed' }
        );
        
        console.log(`Transferred 1 to all ATAs Signature: ${signature}`);
}

main().catch(console.error);