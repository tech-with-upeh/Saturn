// src/types/wallet.ts

export interface CoinAccount {
  id: string; // unique UUID
  chain: "BTC" | "ETH" | "SOL" | "BNB" | string; // flexible
  name: string; // e.g. "Bitcoin", "Solana"
  address: string;
  privateKeyEnc: string; // encrypted private key
  balance: number; // in native coin
  usdValue: number; // balance * price
  percentChange24h: number; // growth %
  tokens?: TokenAsset[]; // e.g. SPL tokens under Solana
}

export interface TokenAsset {
  id: string;
  symbol: string; // e.g. "USDC", "CREPE"
  balance: number;
  usdValue: number;
  percentChange24h: number;
}

export interface Wallet {
  id: string; // UUID
  name: string; // e.g. "Main Wallet"
  mnemonicEnc?: string; // encrypted mnemonic (if HD)
  type: "mnemonic" | "imported";
  accounts: CoinAccount[];
  totalUsdValue: number;
  percentChange24h: number;
}

export interface WalletStore {
  wallets: Wallet[];
  lastUpdated: string;
}
