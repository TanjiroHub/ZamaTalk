export type ZamaTalkChainInfo = {
  address: string;
  chainId: number;
  chainName: string;
};

export const FHEZamaTalkAddresses: Record<string, ZamaTalkChainInfo> = {
  "11155111": {
    address: "0xF2718182a1a464EF9AbC52c7BEdfAd4112484C41",
    chainId: 11155111,
    chainName: "sepolia",
  },
  "31337": {
    address: "0x7553CB9124f974Ee475E5cE45482F90d5B6076BC",
    chainId: 31337,
    chainName: "hardhat",
  },
};
