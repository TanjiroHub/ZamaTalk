import { useEffect } from "react";
import { ethers } from "ethers";
import { INFURA_RPC_ENDPOINT } from "@/constants";
import { FHEZamaTalkABI } from "@/abi/FHEZamaTalkABI";
import { FHEZamaTalkAddresses } from "@/abi/FHEZamaTalkAddresses";

import { useFhevm } from "../../fhevm-react/useFhevm";
import { useInMemoryStorage } from "@/hooks/useInMemoryStorage";
import { useFHEZamaTalkStore } from "@/store/useFHEZamaTalkStore";
import { useMetaMaskEthersSigner } from "@/hooks/metamask/useMetaMaskEthersSigner";

export const useFheInstance = () => {
  const { storage } = useInMemoryStorage();
  const { provider, chainId, initialMockChains } = useMetaMaskEthersSigner();
  const { fhevmIsReady ,setFhevmIsReady, setFheInstance, setFhevmDecryptionSignatureStorage } = useFHEZamaTalkStore();

  const { instance, status } = useFhevm({
    provider,
    chainId,
    initialMockChains,
    enabled: true,
  });

  useEffect(() => {
    if (status === "ready" && !fhevmIsReady) {
      setFhevmDecryptionSignatureStorage(storage)
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
      setContractIsReady(true);
    }
  }, [chainId, ethersSigner, contractAddress, setContracts]);
};

