import { useEffect } from "react";
import { ethers } from "ethers";
import { INFURA_RPC_ENDPOINT } from "@/constants";
import { FHEZamaTalkABI } from "@/abi/FHEZamaTalkABI";
import { FHEZamaTalkAddresses } from "@/abi/FHEZamaTalkAddresses";

import { useFhevm } from "@/fhevm/useFhevm";
import { useFHEZamaTalkStore } from "@/store/useFHEZamaTalkStore";
import { useMetaMaskEthersSigner } from "@/hooks/metamask/useMetaMaskEthersSigner";

export const useFHEZamaTalk = () => {
  const {
    provider,
    chainId,
    ethersSigner,
    initialMockChains,
  } = useMetaMaskEthersSigner();

  const { status: fheStatus, instance: fheInstance } = useFhevm({
    provider,
    chainId,
    initialMockChains,
    enabled: true,
  });

  const {
    contractTx,
    contractView,
    contractAddress,
    setContracts,
    setContractAddress,
    setContractIsReady,
    setFheInstance,
  } = useFHEZamaTalkStore();

  useEffect(() => {
    if (chainId) {
      const address = FHEZamaTalkAddresses[String(chainId)]?.address ?? "";
      setContractAddress(address);
    }
  }, [chainId]);

  useEffect(() => {
    if (chainId && ethersSigner && contractAddress) {
      const contractTx = new ethers.Contract(
        contractAddress,
        FHEZamaTalkABI.abi,
        ethersSigner
      );
      const contractView = new ethers.Contract(
        contractAddress,
        FHEZamaTalkABI.abi,
        new ethers.JsonRpcProvider(INFURA_RPC_ENDPOINT)
      );
      setContracts(contractTx, contractView);
    }
  }, [chainId, ethersSigner, contractAddress]);

  useEffect(() => {
    if (fheStatus === "ready" && contractTx && contractView) {
      setContractIsReady(true);
      setFheInstance(fheInstance);
    }
  }, [fheStatus, contractTx, contractView]);
};
