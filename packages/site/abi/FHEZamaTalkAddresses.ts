export type ZamaTalkChainInfo = {
  address: string;
  chainId: number;
  chainName: string;
};

export const FHEZamaTalkAddresses: Record<string, ZamaTalkChainInfo> = {
  "11155111": {
    address: "0xAD9920343663760Ae36bbcf4e6039a0aE966A6C1",
    chainId: 11155111,
    chainName: "sepolia",
  },
  "31337": {
    address: "0x7553CB9124f974Ee475E5cE45482F90d5B6076BC",
    chainId: 31337,
    chainName: "hardhat",
  },
};
