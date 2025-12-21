export type WalletKeys ={
  name: string;
  privatekey: string;
  publickey: string;
}
export type KeysMeta = {
  id: string;
  mnemonics: string;
  wallets: WalletKeys[];
  createdAt: number;
}

export type CoinMeta = {
  id: string;          // uuid
  name: string;       // "Main Wallet"
  balance: number;
  growthInUsd: number;
  growthInPerc: number;
  address: string;     // public address
  chain: string;
  createdAt: number;
};

export type WalletMeta = {        // user UUID
  name: string;
  totalBalance: number;
  growthInUsd: number;
  growthInPerc: number;
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

