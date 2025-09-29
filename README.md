
<p align="center">
  <img src="/packages//site//public/zama-talk.svg" alt="FHEVM ZamaTalk Logo" width="180"/>
</p>

# FHEVM ZamaTalk

FHEVM ZamaTalk is a **privacy-preserving decentralized messaging application** built on top of the [Zama Fully Homomorphic Encryption Virtual Machine (FHEVM)](https://zama.ai).  
It demonstrates how **encrypted smart contracts** can power secure communication while keeping all user data private — even from the blockchain itself.

---

## 📖 Table of Contents
1. [Introduction](#-introduction)
2. [Core Features](#-core-features)
3. [Future Vision](#-future-vision)
4. [Optimizations](#-optimizations)
5. [Roadmap](#-roadmap)
6. [Getting Started](#-getting-started)
7. [Project Structure](#-project-structure)
8. [Usage Scenarios](#-usage-scenarios)
9. [Limitations](#-limitations)
10. [License](#-license)

---

## 🚀 Introduction

ZamaTalk is designed to show how **end-to-end encrypted chat** can run entirely on-chain with **FHE smart contracts**.  
Unlike traditional dApps, messages are encrypted **before they hit the blockchain**, and can only be decrypted locally by authorized users.

This project demonstrates:
- Secure, private messaging powered by **FHEVM**.
- A modular **frontend (Next.js + React + Zustand + Etherjs + zama-fhe/relayer-sdk)** for UI.
- A robust **backend (Hardhat + Solidity)** for encrypted message storage and reactions.

---

## ✨ Core Features

- 🔐 **Fully Encrypted Messaging** using Zama FHEVM.  
- 😃 **Reactions to messages** (like, love, etc.), stored encrypted on-chain.  
- 🛡️ **Secure storage** with no plaintext leakage.  
- ⚡ **Optimized decryption** for batch-processing multiple messages at once.  
- 💻 **Modern frontend** using Next.js, React, TailwindCSS, Zustand, Etherjs, zama-fhe/relayer-sdk.  
- 🧩 **Smart contract modularity** with Hardhat.  

---

## 🔮 Future Vision

We aim to make FHEVM ZamaTalk a **reference implementation** for building private dApps.  
The long-term goal is to integrate **cross-chain privacy-preserving messaging**, making it possible for users to chat securely across Ethereum, L2s, and beyond.

---

## ⚡ Optimizations

We have implemented several optimizations to ensure **scalability and speed**:

1. **Batch Decryption** – decrypt multiple messages at once, significantly reducing overhead.  
2. **Lightweight ABI Calls** – minimized contract ABI interactions for better gas efficiency.  
3. **Client-Side Caching** – messages and reactions are cached in local stores (Zustand) to avoid unnecessary re-fetches.  
4. **Optimized Hooks** – custom React hooks (`useFHEZamaTalk`, `useInMemoryStorage`) for clean state management.  

These make the app **much faster** while maintaining full encryption guarantees.

---

## 🛣️ Roadmap

**Completed so far:**
- ✅ Encrypted messaging & reactions
- ✅ Optimized batch decryption
- ✅ Fully working dApp with frontend + contracts

**Next milestones:**
1. 🖼️ **User Avatars** – allow users to upload profile pictures.  
2. 📑 **Pagination** – for messages, conversations, and friend lists.  
3. 🌉 **Cross-chain Support** – enabling FHE chat across multiple blockchains.  

---

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git https://github.com/TanjiroHub/ZamaTalk.git
cd ZamaTalk
```

### 2. Install dependencies
```bash
npm install
```

### 3. Compile contracts
```bash
cd packages/fhevm-hardhat-template
npx hardhat compile
```

### 4. Run frontend
```bash
cd ../site
npm run dev
```

Your app should now be running at [http://localhost:3000](http://localhost:3000).

---

## 📂 Project Structure

```
FHEVM-ZAMATALK/
├── packages/
│   ├── fhevm-hardhat-template/     # Hardhat project for contracts
│   │   ├── contracts/              # Solidity contracts
│   │   │   ├── FHEZamaTalk.sol
│   │   │   └── FHECounterSepolia.ts
│   │   ├── deploy/                 # Deployment scripts
│   │   ├── deployments/            # Saved deployment artifacts
│   │   ├── tasks/                  # Custom Hardhat tasks
│   │   ├── test/                   # Contract tests
│   │   ├── hardhat.config.ts
│   │   └── ...
│   │
│   └── site/                       # React (Next.js) frontend
│       ├── abi/                    # ABI files for contracts
│       │   ├── FHEZamaTalkABI.ts
│       │   └── FHEZamaTalkAddresses.ts
│       ├── app/                    # Next.js app directory
|       |   ├── api/v1
|       |   |       ├── encrypt.ts
|       |   |       ├── decrypt.ts
│       │   ├── chat/               # Chat pages/layout
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── providers.tsx
│       ├── components/             # React UI components
│       │   ├── chat/               # Chat-specific UI
│       │   │   ├── ChatBotConversationList.tsx
│       │   │   ├── ChatHeader.tsx
│       │   │   ├── ChatMessageHeader.tsx
│       │   │   ├── ChatMessageInput.tsx
│       │   │   ├── ChatMessages.tsx
│       │   │   └── ChatSidebarUserHeader.tsx
│       │   └── shared/             # Shared UI
│       │       ├── Avatar.tsx
│       │       ├── Container.tsx
│       │       └── Conversation.tsx
│       ├── constants/              # Constant values
│       ├── hooks/                  # React hooks
│       │   ├── useFHEZamaTalk.tsx
│       │   └── useInMemoryStorage.tsx
│       ├── public/                 # Static files
│       ├── scripts/                # Helper scripts
│       │   ├── encrypt.ts
│       │   ├── decrypt.ts
│       │   └── index.ts
│       ├── store/                  # Zustand stores
│       │   ├── useFHEZamaTalkConversationStore.ts
│       │   ├── useFHEZamaTalkLoginStore.ts
│       │   └── useFHEZamaTalkStore.ts
│       ├── styles/                 # Styling (Tailwind, etc.)
│       ├── types/                  # TypeScript types
│       └── utils/                  # Utility functions
│           └── index.ts
│
├── README.md
├── LICENSE
├── package.json
├── tsconfig.json
└── ...

```

---

## 🎯 Usage Scenarios

- **Private messaging dApps** – where confidentiality is essential.  
- **On-chain DAOs** – encrypted governance communications.  
- **Healthcare/Finance** – industries needing **zero-trust, encrypted communication**.  

---

## ⚠️ Limitations

- FHE operations remain more expensive than plaintext.  
- Current version optimized for **demo & research**, not mass production.  
- Performance depends on **browser cryptography APIs**.  

---

## Documentation

- [Hardhat + MetaMask](https://docs.metamask.io/wallet/how-to/run-devnet/): Set up your local devnet step by step using Hardhat and MetaMask.
- [FHEVM Documentation](https://docs.zama.ai/protocol/solidity-guides/)
- [FHEVM Hardhat](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat)
- [@zama-fhe/relayer-sdk Documentation](https://docs.zama.ai/protocol/relayer-sdk-guides/)
- [Setting up MNEMONIC and INFURA_API_KEY](https://docs.zama.ai/protocol/solidity-guides/getting-started/setup#set-up-the-hardhat-configuration-variables-optional)
- [React Documentation](https://reactjs.org/)
- [FHEVM Discord Community](https://discord.com/invite/zama)
- [GitHub Issues](https://github.com/zama-ai/fhevm-react-template/issues)

---

## 📜 License

This project is licensed under the **MIT License**.  
See [LICENSE](./LICENSE) for details.

---

<p align="center">Made with ❤️ and FHE by ZamaTalk contributors.</p>
