import * as tinysecp from "@bitcoinerlab/secp256k1";
import { HDKey } from "@scure/bip32";
import { Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import { Buffer } from "buffer";
import { ECPairFactory } from "ecpair";
import { ethers } from "ethers";

const ECPair = ECPairFactory(tinysecp);


export interface Coins {
  name: string;
      address: string;
      chain: string;
      privateKey: string;
      
}
export interface WalletResult {
  mnemonic: string;
  wallets: Coins[];
}

export function validateMnemonic(mnemonic: string): boolean {
  return bip39.validateMnemonic(mnemonic);
}

export async function generatefromMnemonics(
  mnemonic?: string
): Promise<WalletResult> {
  // Generate or use given mnemonic
  const finalMnemonic = mnemonic || bip39.generateMnemonic(128);
  
  const seed = await bip39.mnemonicToSeed(finalMnemonic);
  const root = HDKey.fromMasterSeed(seed);
  console.log("Generating Mnemonic:", finalMnemonic);
  // BTC (Bech32 bc1) → m/84'/0'/0'/0/0
  const btcNode = root.derive("m/84'/0'/0'/0/0");
  const btcprivatekey = btcNode.privateKey;
  const btcpublickey = btcNode.publicKey;

  if (!btcprivatekey) throw new Error("Failed to derive BTC private key");
  const btcKeypair = ECPair.fromPrivateKey(Buffer.from(btcprivatekey), { network: bitcoin.networks.bitcoin });
  const btcWif = btcKeypair.toWIF();
  
  
  const { address: btcAddress, pubkeys } = bitcoin.payments.p2wpkh({
    pubkey: btcNode.publicKey!,
    network: bitcoin.networks.bitcoin,
  });

  //  ETH → m/44'/60'/0'/0/0
  const ethWallet =
    ethers.HDNodeWallet.fromSeed(seed).derivePath("m/44'/60'/0'/0/0");


  //  BNB (BSC standard) → m/44'/60'/0'/0/1
  const bnbWallet =
    ethers.HDNodeWallet.fromSeed(seed).derivePath("m/44'/60'/0'/0/1");


  // SOL (random keypair)
  const solKeypair = Keypair.generate();
  const solAddress = solKeypair.publicKey.toBase58();
  const solPrivateKey = Buffer.from(solKeypair.secretKey).toString("hex");

  // Return all
  return {
    mnemonic: finalMnemonic,
    // wallets: {
    //   BTC: btcAddress || "", 
    //   ETH: ethWallet.address,
    //   BNB: bnbWallet.address,
    //   SOL: solAddress,
    // },
    wallets: [
      {
        name: "bitcoin",
        chain: "btc",
        address: btcAddress || "",
        privateKey: btcWif
      },
      {
        name: "ethereum",
        chain: "eth",
        address: ethWallet.address || "",
        privateKey: ethWallet.privateKey
      },
      {
        name: "solana",
        chain: "sol",
        address: solAddress,
        privateKey: solPrivateKey
      },
      {
        name: "BNB",
        chain: "BSC",
        address: bnbWallet.address,
        privateKey: bnbWallet.privateKey
      }
    ]
  };
}
