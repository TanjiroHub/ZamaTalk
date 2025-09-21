export type Conversation = {
  id: string;
  info: string;
  sender?: string;
  receiver?: string;
  senderName?: string;
  receiverName?: string;
  createdAt?: number;
  status?: number;
};

export type Message = {
  message: string;
  sentTime?: string;
  sender?: string;
  direction?: "incoming" | "outgoing";
  position?: "single" | "first" | "middle" | "last";
  avatar?: string;
};

export type UserProfile = {
  id: string;
  wallet: string,
  name: string;
  avatarUrl: string;
  createdAt: number;
  active: boolean;
};
