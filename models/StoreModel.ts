import { create } from "zustand";

const useStore = create((set) => ({
    balance: 0,
    setBalance: (balance : number) => set({ balance }),
    userprofile: {},
    setUserprofile: (userprofile : any) => set({ userprofile }),
    ActiveWallet: {},
    setActiveWallet: (ActiveWallet : any) => set({ ActiveWallet }),
  }))

export default useStore
