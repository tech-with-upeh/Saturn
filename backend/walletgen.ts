import { test } from "@/constants/appconstants";
import * as tinysecp from "@bitcoinerlab/secp256k1";
import { HDKey } from "@scure/bip32";
import { Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import { Buffer } from "buffer";
import { ECPairFactory } from "ecpair";
import slip10  from "micro-key-producer/slip10.js";
import { ethers } from "ethers";
import bs58 from 'bs58'

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

const mnemdanic = "7VUGgDLwSHgUF5cZ2Gvy2xKPUutqnSjJQjNSejbx3cEL";

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
  // BTC (Bech32 bc1) → m/84'/0'/0'/0/0
  const btcNode = test
    ? root.derive("m/84'/1'/0'/0/0")
    : root.derive("m/84'/0'/0'/0/0");

  const btcprivatekey = btcNode.privateKey;
  if (!btcprivatekey) throw new Error("Failed to derive BTC private key");

  const btcKeypair = ECPair.fromPrivateKey(
    Buffer.from(btcprivatekey),
    { network: test ? bitcoin.networks.testnet : bitcoin.networks.bitcoin }
  );

  const btcWif = btcKeypair.toWIF();

  const { address: btcAddress } = bitcoin.payments.p2wpkh({
    pubkey: btcNode.publicKey!,
    network: test ? bitcoin.networks.testnet : bitcoin.networks.bitcoin,
  });

  // ETH → m/44'/60'/0'/0/0
  const ethWallet = ethers.HDNodeWallet
    .fromSeed(seed)
    .derivePath("m/44'/60'/0'/0/0");

  // BNB (BSC) → m/44'/60'/0'/0/1
  const bnbWallet = ethers.HDNodeWallet
    .fromSeed(seed)
    .derivePath("m/44'/60'/0'/0/1");

 
 
  // SOL → SLIP-0010 ED25519
  const solDerivationPath = "m/44'/501'/1'/0'";
  const solhdkey = slip10.fromMasterSeed(seed);
  const solPrivateKeybytes = solhdkey.privateKey
  const solKeypair = Keypair.fromSeed(solPrivateKeybytes);
  
  const solAddress = solKeypair.publicKey.toBase58();
  const solPrivateKey = Buffer.from(solKeypair.secretKey).toString("hex");
  
  return {
    mnemonic: finalMnemonic,
    wallets: [
      {
        name: "bitcoin",
        chain: "btc",
        address: btcAddress || "",
        privateKey: btcWif,
      },
      {
        name: "ethereum",
        chain: "eth",
        address: ethWallet.address,
        privateKey: ethWallet.privateKey,
      },
      {
        name: "solana",
        chain: "sol",
        address: solAddress,
        privateKey: solPrivateKey,
      },
      {
        name: "BNB",
        chain: "BSC",
        address: bnbWallet.address,
        privateKey: bnbWallet.privateKey,
      },
    ],
  };
}
