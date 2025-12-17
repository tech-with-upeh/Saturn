// src/constants/coinIcons.ts
import btc from "@/assets/images/bitcoin.png";
import bsc from "@/assets/images/bnb.png";
import nocoin from "@/assets/images/coin.png";
import eth from "@/assets/images/ethereum.png";
import sol from "@/assets/images/solana.png";

export const COIN_ICONS: Record<string, any> = {
  btc: btc,
  eth: eth,
  solana: sol,
  bsc: bsc,
  nocoin: nocoin,
};

export const sampledata = [
  {
    name: "Solana",
    balance: "100",
    usdValue: "1233",
    growth: "12",
    chainId: "solana",
  },
  {
    name: "Bitcoin",
    balance: "110",
    usdValue: "143",
    growth: "10",
    chainId: "btc",
  },
  {
    name: "Ethereum",
    balance: "230",
    usdValue: "43",
    growth: "9",
    chainId: "eth",
  },
];
