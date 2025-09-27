export const FHEZamaTalkABI = {
  abi: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "conversationId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "sender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "receiver",
          type: "address",
        },
      ],
      name: "ConversationCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "messageId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "conversationId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "to",
          type: "address",
        },
      ],
      name: "MessageSent",
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
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "msgId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "by",
          type: "address",
        },
      ],
      name: "ReactionChanged",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "msgId",
          type: "uint256",
        },
        {
          internalType: "externalEuint256",
          name: "reactionExt",
          type: "bytes32",
        },
        {
          internalType: "bytes",
          name: "proof",
          type: "bytes",
        },
      ],
      name: "changeReaction",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "conversations",
      outputs: [
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "sender",
          type: "address",
        },
        {
          internalType: "address",
          name: "receiver",
          type: "address",
        },
        {
          internalType: "string",
          name: "senderName",
          type: "string",
        },
        {
          internalType: "string",
          name: "receiverName",
          type: "string",
        },
        {
          internalType: "uint64",
          name: "createdAt",
          type: "uint64",
        },
        {
          internalType: "enum FHEZamaTalk.Status",
          name: "status",
          type: "uint8",
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
      inputs: [
        {
          internalType: "uint256",
          name: "msgId",
          type: "uint256",
        },
      ],
      name: "getMessage",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "conversationId",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              internalType: "address",
              name: "receiver",
              type: "address",
            },
            {
              internalType: "uint64",
              name: "createdAt",
              type: "uint64",
            },
            {
              internalType: "enum FHEZamaTalk.Status",
              name: "status",
              type: "uint8",
            },
            {
              internalType: "euint256[]",
              name: "content",
              type: "bytes32[]",
            },
            {
              internalType: "euint256",
              name: "reaction",
              type: "bytes32",
            },
          ],
          internalType: "struct FHEZamaTalk.Message",
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
          internalType: "uint256",
          name: "conversationId",
          type: "uint256",
        },
      ],
      name: "getMessages",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "conversationId",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              internalType: "address",
              name: "receiver",
              type: "address",
            },
            {
              internalType: "uint64",
              name: "createdAt",
              type: "uint64",
            },
            {
              internalType: "enum FHEZamaTalk.Status",
              name: "status",
              type: "uint8",
            },
            {
              internalType: "euint256[]",
              name: "content",
              type: "bytes32[]",
            },
            {
              internalType: "euint256",
              name: "reaction",
              type: "bytes32",
            },
          ],
          internalType: "struct FHEZamaTalk.Message[]",
          name: "out",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
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
              internalType: "address",
              name: "wallet",
              type: "address",
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
      inputs: [],
      name: "getProfiles",
      outputs: [
        {
          components: [
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "address",
              name: "wallet",
              type: "address",
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
          internalType: "struct FHEZamaTalk.UserProfile[]",
          name: "profilesArray",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "messages",
      outputs: [
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "conversationId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "sender",
          type: "address",
        },
        {
          internalType: "address",
          name: "receiver",
          type: "address",
        },
        {
          internalType: "uint64",
          name: "createdAt",
          type: "uint64",
        },
        {
          internalType: "enum FHEZamaTalk.Status",
          name: "status",
          type: "uint8",
        },
        {
          internalType: "euint256",
          name: "reaction",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "acount",
          type: "address",
        },
      ],
      name: "myConversations",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              internalType: "address",
              name: "receiver",
              type: "address",
            },
            {
              internalType: "string",
              name: "senderName",
              type: "string",
            },
            {
              internalType: "string",
              name: "receiverName",
              type: "string",
            },
            {
              internalType: "uint64",
              name: "createdAt",
              type: "uint64",
            },
            {
              internalType: "enum FHEZamaTalk.Status",
              name: "status",
              type: "uint8",
            },
          ],
          internalType: "struct FHEZamaTalk.Conversation[]",
          name: "out",
          type: "tuple[]",
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
          internalType: "address",
          name: "wallet",
          type: "address",
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
      inputs: [],
      name: "protocolId",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "pure",
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
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "externalEuint256[]",
          name: "contentExt",
          type: "bytes32[]",
        },
        {
          internalType: "bytes[]",
          name: "proofs",
          type: "bytes[]",
        },
        {
          internalType: "externalEuint256",
          name: "reactionExt",
          type: "bytes32",
        },
        {
          internalType: "bytes",
          name: "reactionProof",
          type: "bytes",
        },
      ],
      name: "sendMessage",
      outputs: [],
      stateMutability: "nonpayable",
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
