export const FHEZamaTalkABI = {
  abi: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "name",
          type: "string",
        },
      ],
      name: "ProfileCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "field",
          type: "string",
        },
      ],
      name: "ProfileUpdated",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          internalType: "string",
          name: "avatarUrl",
          type: "string",
        },
      ],
      name: "createProfile",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "deactivateProfile",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "getProfile",
      outputs: [
        {
          components: [
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "avatarUrl",
              type: "string",
            },
            {
              internalType: "uint64",
              name: "createdAt",
              type: "uint64",
            },
            {
              internalType: "bool",
              name: "active",
              type: "bool",
            },
          ],
          internalType: "struct FHEZamaTalk.UserProfile",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
      ],
      name: "nameExists",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "profiles",
      outputs: [
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          internalType: "string",
          name: "avatarUrl",
          type: "string",
        },
        {
          internalType: "uint64",
          name: "createdAt",
          type: "uint64",
        },
        {
          internalType: "bool",
          name: "active",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
      ],
      name: "resolveName",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "newAvatar",
          type: "string",
        },
      ],
      name: "updateAvatar",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
} as const;
