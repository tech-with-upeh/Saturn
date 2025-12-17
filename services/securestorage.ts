import { WalletStore } from "@/constants/types";
import CryptoJS from "crypto-js";
import * as SecureStore from "expo-secure-store";

const STORAGE_KEY = "wallet_store";

export async function saveWalletStore(data: WalletStore, password: string) {
  const json = JSON.stringify(data);
  const cipher = CryptoJS.AES.encrypt(json, password).toString();
  await SecureStore.setItemAsync(STORAGE_KEY, cipher);
}

export async function loadWalletStore(
  password: string
): Promise<WalletStore | null> {
  const cipher = await SecureStore.getItemAsync(STORAGE_KEY);
  if (!cipher) return null;

  const bytes = CryptoJS.AES.decrypt(cipher, password);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
}
export async function clearWalletStore() {
  await SecureStore.deleteItemAsync(STORAGE_KEY);
}
