// src/models/UserProfile.ts

export type Chain = 'ETH' | 'BTC' | 'SOL';

export type CoinMeta = {
  id: string;          // uuid
  name: string;       // "Main Wallet"
  balance: number;
  growthInUsd: number;
  growthInPerc: number;
  address: string;     // public address
  chain: Chain;
  createdAt: number;
};

export type WalletMeta = {
  id: string;          // user UUID
  name: string;
  totalBalance: number;
  coins: CoinMeta[];
  createdAt: number;
  lastActiveAt: number;
};

export type UserMeta = {
    id: string;
    name: string;
    networth: number;
    wallets: WalletMeta[]
}

