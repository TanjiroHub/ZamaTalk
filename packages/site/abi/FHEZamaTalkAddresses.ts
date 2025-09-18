export type ZamaTalkChainInfo = {
  address: string;
  chainId: number;
  chainName: string;
};

export const FHEZamaTalkAddresses: Record<string, ZamaTalkChainInfo> = {
  "11155111": {
    address: "0x1e1092F7B12e44B47d80895A1Fd170da0D261a08",
    chainId: 11155111,
    chainName: "sepolia",
  },
  "31337": {
    address: "0x7553CB9124f974Ee475E5cE45482F90d5B6076BC",
    chainId: 31337,
    chainName: "hardhat",
  },
};
