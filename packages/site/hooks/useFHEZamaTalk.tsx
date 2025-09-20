import { useEffect } from "react";
import { ethers } from "ethers";
import { INFURA_RPC_ENDPOINT } from "@/constants";
import { FHEZamaTalkABI } from "@/abi/FHEZamaTalkABI";
import { FHEZamaTalkAddresses } from "@/abi/FHEZamaTalkAddresses";

import { useFhevm } from "../../fhevm-react/useFhevm";
import { useFHEZamaTalkStore } from "@/store/useFHEZamaTalkStore";
import { useMetaMaskEthersSigner } from "@/hooks/metamask/useMetaMaskEthersSigner";

export const useFheInstance = () => {
  const { setFhevmIsReady, setFheInstance } = useFHEZamaTalkStore();
  const { provider, chainId, initialMockChains } = useMetaMaskEthersSigner();

  const { instance, status } = useFhevm({
    provider,
    chainId,
    initialMockChains,
    enabled: true,
  });

  useEffect(() => {
    if (status === "ready") {
      setFheInstance(instance);
      setFhevmIsReady(true);
    }
  }, [status]);
};

export const useFHEZamaTalkContracts = () => {
  const { chainId, ethersSigner } = useMetaMaskEthersSigner();
  const { contractAddress, setContractAddress, setContracts, setContractIsReady } = useFHEZamaTalkStore();

  useEffect(() => {
    if (chainId) {
      const address = FHEZamaTalkAddresses[String(chainId)]?.address ?? "";
      setContractAddress(address);
    }
  }, [chainId, setContractAddress]);

  useEffect(() => {
    if (chainId && ethersSigner && contractAddress) {
      const txContract = new ethers.Contract(
        contractAddress,
        FHEZamaTalkABI.abi,
        ethersSigner
      );
      const viewContract = new ethers.Contract(
        contractAddress,
        FHEZamaTalkABI.abi,
        new ethers.JsonRpcProvider(INFURA_RPC_ENDPOINT)
      );
      setContracts(txContract, viewContract);
      setContractIsReady(true);
    }
  }, [chainId, ethersSigner, contractAddress, setContracts]);
};

