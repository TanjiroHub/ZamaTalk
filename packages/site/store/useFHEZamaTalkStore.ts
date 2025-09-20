import { create } from "zustand";
import { ethers } from "ethers";

type FHEZamaTalkStore = {
  contractTx: ethers.Contract | null;
  contractView: ethers.Contract | null;
  contractAddress: string;
  contractIsReady: boolean;
  fhevmIsReady: boolean;
  fheInstance: any | null;

  setContracts: (tx: ethers.Contract, view: ethers.Contract) => void;
  setContractAddress: (address: string) => void;
  setContractIsReady: (ready: boolean) => void;
  setFhevmIsReady: (ready: boolean) => void;
  setFheInstance: (instance: any) => void;
};

export const useFHEZamaTalkStore = create<FHEZamaTalkStore>((set) => ({
  contractTx: null,
  contractView: null,
  contractAddress: "",
  contractIsReady: false,
  fhevmIsReady: false,
  fheInstance: null,

  setContracts: (tx, view) => set({ contractTx: tx, contractView: view }),
  setContractAddress: (address) => set({ contractAddress: address }),
  setContractIsReady: (ready) => set({ contractIsReady: ready }),
  setFhevmIsReady: (ready) => set({ fhevmIsReady: ready }),
  setFheInstance: (instance) => set({ fheInstance: instance }),
}));
