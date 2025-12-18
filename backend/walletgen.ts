import { HDKey } from "@scure/bip32";
import { Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import { Buffer } from "buffer";
import { ethers } from "ethers";


export interface Coins {
  name: string;
      address: string;
      chain: string;
}
export interface WalletResult {
  mnemonic: string;
  wallets: Coins[];
}

export async function generatefromMnemonics(
  mnemonic?: string
): Promise<WalletResult> {
  // 1️⃣ Generate or use given mnemonic
  const finalMnemonic = mnemonic || bip39.generateMnemonic(128);
  const seed = await bip39.mnemonicToSeed(finalMnemonic);
  const root = HDKey.fromMasterSeed(seed);
  console.log("Generating Mnemonic:", finalMnemonic);
  // 2️⃣ BTC (Bech32 bc1) → m/84'/0'/0'/0/0
  const btcNode = root.derive("m/84'/0'/0'/0/0");
  const btcprivatekey = btcNode.privateKey;
  const btcPublic = btcNode.publicKey;
  console.log("------>",btcprivatekey?.toString());

  const { address: btcAddress, pubkeys } = bitcoin.payments.p2wpkh({
    pubkey: btcNode.publicKey!,
    network: bitcoin.networks.bitcoin,
  });

  // 3️⃣ ETH (MetaMask standard) → m/44'/60'/0'/0/0
  const ethWallet =
    ethers.HDNodeWallet.fromSeed(seed).derivePath("m/44'/60'/0'/0/0");

  // 4️⃣ BNB (BSC standard) → m/44'/60'/0'/0/1
  const bnbWallet =
    ethers.HDNodeWallet.fromSeed(seed).derivePath("m/44'/60'/0'/0/1");

  // 5️⃣ SOL (random keypair)
  const solKeypair = Keypair.generate();
  const solAddress = solKeypair.publicKey.toBase58();
  const solPrivateKey = Buffer.from(solKeypair.secretKey).toString("hex");

  console.log("Generated SOL Address:", solAddress);
  console.log("SOL Private Key (hex):", solPrivateKey);

  // ✅ Return all
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
        address: btcAddress || ""
      },
      {
        name: "ethereum",
        chain: "eth",
        address: ethWallet.address || ""
      },
      {
        name: "solana",
        chain: "sol",
        address: solAddress
      },
      {
        name: "BNB",
        chain: "BSC",
        address: bnbWallet.address
      }
    ]
  };
}
