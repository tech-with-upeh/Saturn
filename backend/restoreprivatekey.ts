import * as ecc from "@bitcoinerlab/secp256k1";
import { Keypair } from "@solana/web3.js";
import * as bitcoin from "bitcoinjs-lib";
import bs58 from "bs58";
import { Buffer } from "buffer";
import { ECPairFactory } from "ecpair";
import { ethers } from "ethers";

const ECPair = ECPairFactory(ecc);


export interface RestoredWallets {
  [x: string]: any;
  BTC: string;
  ETH: string;
  SOL: string;
}

export function restoreFromPrivateKeys(key : string, network : string) : RestoredWallets {
  const result: RestoredWallets = { BTC: "", ETH: "", SOL: "" };

  const isValidHex = (val: string) =>
    typeof val === "string" && /^[0-9a-fA-F]+$/.test(val.trim());
  const isWIF = (val: string) =>
    typeof val === "string" &&
    /^[5KL][1-9A-HJ-NP-Za-km-z]{50,51}$/.test(val.trim());
    
  switch (network) {
    case "BTC":
     // BTC
    try {
      if (key != "") {
        let keyPair;
        if (isValidHex(key)) {
          const privateKey = Buffer.from(key.trim(), "hex");
          keyPair = ECPair.fromPrivateKey(privateKey);
        } else if (isWIF(key)) {
          keyPair = ECPair.fromWIF(key.trim(), bitcoin.networks.bitcoin);
        } else {
          throw new Error("Invalid BTC key format");
        }

        const { address } = bitcoin.payments.p2wpkh({
          pubkey: keyPair.publicKey,
          network: bitcoin.networks.bitcoin,
        });
        result.BTC = address || "";
      } else {
        throw new Error("Invalid BTC key format");
      }
    } catch (err) {
      throw new Error("BTC restore failed:");
    }
      break;
      
    case "ETH":
      // ETH
      try {
        let cleanKey = key.trim();
        // If it looks like a hex string but missing 0x, add it.
        // A 64-char hex string is likely a private key without prefix.
        if (!cleanKey.startsWith("0x") && /^[0-9a-fA-F]{64}$/.test(cleanKey)) {
          cleanKey = "0x" + cleanKey;
        }

        if (cleanKey !== "") {
          const wallet = new ethers.Wallet(cleanKey);
          result.ETH = wallet.address;
        } else {
           throw new Error("Empty ETH key");
        }
      } catch (err) {
        throw new Error("ETH restore failed:");
      }
      break;

    case "SOL":
      // SOL
      try {
        const cleanKey = key.trim();
        let solBuffer: Uint8Array | null = null;
        
        // 1. Check if it's a JSON array format (e.g., [12, 244, ...])
        if (cleanKey.startsWith("[") && cleanKey.endsWith("]")) {
          try {
             const parsed = JSON.parse(cleanKey);
             if (Array.isArray(parsed)) {
                solBuffer = new Uint8Array(parsed);
             }
          } catch (e) {
             throw new Error("Failed to parse SOL key as JSON array");
          }
        } 
        
        // 2. Check if it's a Hex string
        if (!solBuffer && /^[0-9a-fA-F]+$/.test(cleanKey)) {
             // 64 bytes = 128 hex chars (Secret Key)
             // 32 bytes = 64 hex chars (Seed)
             if (cleanKey.length === 128 || cleanKey.length === 64) {
                 try {
                    solBuffer = new Uint8Array(Buffer.from(cleanKey, "hex"));
                 } catch (e) {
                    throw new Error("Failed to parse SOL key as Hex");
                 }
             }
        }

        // 3. If not successfully parsed as array or hex, try Base58
        if (!solBuffer) {
           try {
             solBuffer = bs58.decode(cleanKey);
           } catch (e) {
             throw new Error("Failed to decode SOL key as Base58");
           }
        }

        if (solBuffer) {
          if (solBuffer.length === 64) {
            const keypair = Keypair.fromSecretKey(solBuffer);
            result.SOL = keypair.publicKey.toBase58();
          } else if (solBuffer.length === 32) {
             const keypair = Keypair.fromSeed(solBuffer);
             result.SOL = keypair.publicKey.toBase58();
          } else {
             throw new Error("Invalid SOL key length:");
          }
        } else {
           throw new Error("Could not resolve SOL key format");
        }
      } catch (err) {
        console.error("SOL restore failed:", (err as Error).message);
      }
      break;
    default:
      break;
  }

  return result;
}
