export type ZamaTalkChainInfo = {
  address: string;
  chainId: number;
  chainName: string;
};

export const FHEZamaTalkAddresses: Record<string, ZamaTalkChainInfo> = {
  "11155111": {
    address: "0x13E99F12D3A297e86B7730D6fEb36B5616443627",
    chainId: 11155111,
    chainName: "sepolia",
  },
  "31337": {
    address: "0x7553CB9124f974Ee475E5cE45482F90d5B6076BC",
    chainId: 31337,
    chainName: "hardhat",
  },
};
