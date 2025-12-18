import * as ecc from "@bitcoinerlab/secp256k1";
import { Keypair } from "@solana/web3.js";
import * as bitcoin from "bitcoinjs-lib";
import bs58 from "bs58";
import { Buffer } from "buffer";
import { ECPairFactory } from "ecpair";
import { ethers } from "ethers";

const ECPair = ECPairFactory(ecc);

export interface RestoredWallets {
  BTC: string;
  ETH: string;
  SOL: string;
}

export function restoreFromPrivateKeys(keys: {
  btc?: string; // can be hex or WIF
  eth?: string;
  sol?: string;
}): RestoredWallets {
  const result: RestoredWallets = { BTC: "", ETH: "", SOL: "" };

  const isValidHex = (val?: string) =>
    typeof val === "string" && /^[0-9a-fA-F]+$/.test(val.trim());
  const isWIF = (val?: string) =>
    typeof val === "string" &&
    /^[5KL][1-9A-HJ-NP-Za-km-z]{50,51}$/.test(val.trim());

  // BTC
  try {
    if (keys.btc) {
      let keyPair;
      if (isValidHex(keys.btc)) {
        const privateKey = Buffer.from(keys.btc!.trim(), "hex");
        keyPair = ECPair.fromPrivateKey(privateKey);
      } else if (isWIF(keys.btc)) {
        keyPair = ECPair.fromWIF(keys.btc!.trim(), bitcoin.networks.bitcoin);
      } else {
        throw new Error("Invalid BTC key format");
      }
 
      const { address } = bitcoin.payments.p2wpkh({
        pubkey: keyPair.publicKey,
        network: bitcoin.networks.bitcoin,
      });
      result.BTC = address || "";
    }
  } catch (err) {
    console.log("BTC restore failed:", (err as Error).message);
  }

  // ETH
  //   pass 0x.....
  try {
    if (isValidHex(keys.eth) && keys.eth!.length === 64) {
      const wallet = new ethers.Wallet("0x" + keys.eth!.trim());
      result.ETH = wallet.address;
    } else {
      console.log("Invalid ETH key format");
    }
  } catch (err) {
    console.log("ETH restore failed:", (err as Error).message);
  }

  // SOL
  try {
    console.log("Solana Key:", keys.sol);
    const solBuffer = bs58.decode(keys.sol ?? "");
    console.log("Solana Buffer Length:", solBuffer.length);
    console.log("Solana Buffer:", solBuffer);
    if (solBuffer.length === 64) {
      console.log("Solana:", solBuffer.toString());
      const keypair = Keypair.fromSecretKey(solBuffer);
      result.SOL = keypair.publicKey.toBase58();
    } else if (solBuffer.length === 32) {
      console.log("Solana:", solBuffer.toString());
      const keypair = Keypair.fromSeed(solBuffer);
      result.SOL = keypair.publicKey.toBase58();
    } else {
      console.warn("⚠️ Invalid Solana key length");
    }
  } catch (err) {
    console.log("SOL restore failed:", (err as Error).message);
  }

  return result;
}
