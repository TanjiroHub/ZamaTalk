export type Conversation = {
  id: number;
  info: string;
  sender?: string;
  receiver?: string;
  senderName?: string;
  receiverName?: string;
  createdAt?: number;
  status?: number;
};

export type Message = {
  id: number;
  content: string;
  createdAt?: number;
  sender?: string;
  direction?: "incoming" | "outgoing";
  position?: "single" | "first" | "middle" | "last";
  avatar?: string;
};

export type EncryptedMessage = {
  id: bigint;
  createdAt: bigint;
  sender: string;
  content: Uint8Array[];
};

export type UserProfile = {
  id: string;
  wallet: string;
  name: string;
  avatarUrl: string;
  createdAt: number;
  active: boolean;
};
