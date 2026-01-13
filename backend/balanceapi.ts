
import { etherscan, test } from "@/constants/appconstants";
import { ethers } from "ethers";

export const getPrices = async () => {
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin&vs_currencies=usd");
        if (!response.ok) {
            throw new Error(`Coingecko API Error: ${response.status}`);
        }
        const data = await response.json();
        return {
            btc: data.bitcoin.usd,
            eth: data.ethereum.usd,
            sol: data.solana.usd,
            bnb: data.binancecoin.usd
        };
    } catch (error) {
        console.error("Error fetching prices:", error);
        return { btc: 0, eth: 0, sol: 0, bnb: 0 };
    }
};



export const getBtcBalance = async (address: string) => {
    if (!address) {
        console.warn("getBtcBalance: No address provided");
        return null;
    }

    const url = test ? "https://blockstream.info/testnet/api/" : "https://blockstream.info/api/";
    console.log(url)
    try {
        const response = await fetch(`${url}address/${address}`);  // https://blockstream.info/testnet/api/
        if (!response.ok) {
            throw new Error(`Blockstream API Error: ${response.status}`);
        }
        const data = await response.json();

        console.log(data)
        // Safely access properties with optional chaining
        const chain_funded = data.chain_stats.funded_txo_sum
        const chain_spent = data.chain_stats.spent_txo_sum 
        const mempool_funded = data.mempool_stats.funded_txo_sum
        const mempool_spent = data.mempool_stats.spent_txo_sum

        console.log(chain_funded, chain_spent)
        const confirmed = chain_funded - chain_spent;
        const unconfirmed = mempool_funded - mempool_spent;
        console.log(confirmed)
        return {
            confirmed_sats: confirmed,
            unconfirmed_sats: unconfirmed,
            total_sats: confirmed + unconfirmed,
            btc: (confirmed + unconfirmed) / 100000000, // 1e8
        };
    } catch (error) {
        console.error("Error fetching balance:", error);
        console.log("Failed address:", address);
        return null;
    }
};


export const getEthBalance = async (address: string) => {
    if (!address) {
        console.warn("getEthBalance: No address provided");
        return null;
    }
    
    try {
        console.log(process.env.EXPO_PUBLIC_ETHERSCAN_API_KEY)
        const response = await fetch(`https://${etherscan}/v2/api?chainid=${test ? 11155111 : 1}&module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.EXPO_PUBLIC_ETHERSCAN_API_KEY}`);
        if (!response.ok) {
            throw new Error(`Etherscan API Error: ${response.status}`);
        }
        const data = await response.json();
        const balanceInEth = ethers.formatEther(data.result);

    return balanceInEth;
    } catch (error) {
        console.error("Error fetching balance:", error);
        console.log("Failed address:", address);
        return null;
    }
};

export const getSolBalance = async (address: string) => {
    if (!address) {
        console.warn("getSolBalance: No address provided");
        return null;
    }
    
    try {
        // const response = await fetch(`https://api.solscan.io/account/balance?address=${address}`);
        const response = await fetch(`${test ?  "https://api.devnet.solana.com" : "https://api.mainnet-beta.solana.com"}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "getBalance",
                params: [address],
            }),
        });
        if (!response.ok) {
            throw new Error(`Solscan API Error: ${response.status}`);
        }
        const data = await response.json();
        return data.result.value / 1e9;
    } catch (error) {
        console.error("Error fetching balance:", error);
        console.log("Failed address:", address);
        return null;
    }
};

export const getBnbBalance = async (address: string) => {
    if (!address) {
        console.warn("getBnbBalance: No address provided");
        return null;
    }
    
    try {
        const url = test ? "https://data-seed-prebsc-1-s1.binance.org:8545/" : "https://bsc-dataseed.binance.org/";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "eth_getBalance",
                params: [address, "latest"],
            }),
        });
        if (!response.ok) {
            throw new Error(`BSC RPC Error: ${response.status}`);
        }
        const data = await response.json();
        return parseFloat(ethers.formatEther(data.result));
    } catch (error) {
        console.error("Error fetching balance:", error);
        console.log("Failed address:", address);
        return null;
    }
};