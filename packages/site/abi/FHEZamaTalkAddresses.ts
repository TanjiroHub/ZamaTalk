export type ZamaTalkChainInfo = {
  address: string;
  chainId: number;
  chainName: string;
};

export const FHEZamaTalkAddresses: Record<string, ZamaTalkChainInfo> = {
  "11155111": {
    address: "0x6513278c5f96A37175e7c602e48246A0Ac6a09a8",
    chainId: 11155111,
    chainName: "sepolia",
  },
  "31337": {
    address: "0x7553CB9124f974Ee475E5cE45482F90d5B6076BC",
    chainId: 31337,
    chainName: "hardhat",
  },
};
