import { create } from "zustand";
import { Message, EncryptedMessage, Conversation } from "@/types";
import { useFHEZamaTalkStore } from "./useFHEZamaTalkStore";
import { useFHEZamaTalkLoginStore } from "./useFHEZamaTalkLoginStore";

type ZamaTalkConversationStore = {
  loading: boolean;
  setLoading: (value: boolean) => void;

  conversations: Conversation[];
  addConversation: (convo: Conversation) => void;
  setConversations: (convos: Conversation[]) => void;
  fetchConversations: () => Promise<Conversation[] | void>;

  activeConversation: Conversation | null;
  getActiveConversation: () => Conversation | null;
  setActiveConversation: (conversation: Conversation | null) => void;

  activeMessages: Message[];
  setActiveMessages: (messages: Message[]) => void;
  getActiveMessages: () => Message[];
  fetchActiveMessages: (id: number) => Promise<EncryptedMessage[]>;
  sendMessage: (messages: { ciphertexts: Uint8Array[]; proofs: Uint8Array[] }, reaction: { ciphertext: Uint8Array; proof: Uint8Array }) => Promise<void>;
  fetchMessage: (id: number) => Promise<EncryptedMessage | void>;

  reactionMessage: (messageId: number, reaction: { ciphertext: Uint8Array; proof: Uint8Array }) => Promise<boolean>;
};

export const useFHEZamaTalkConversationStore =
  create<ZamaTalkConversationStore>((set, get) => ({
    loading: false,
    setLoading: (value: boolean) => set({ loading: value }),

    conversations: [],
    setConversations: (convos) => set({ conversations: convos }),
    getActiveConversation: () => get().activeConversation,
    addConversation: (convo) => set((s) => ({ conversations: [convo, ...s.conversations] })),
    fetchConversations: async () => {
      try {
        const { contractView } = useFHEZamaTalkStore.getState();
        const { profile } = useFHEZamaTalkLoginStore.getState();

        const conversations = await contractView?.myConversations(profile?.wallet);
        const sortedConversations = [...conversations].sort((a: Conversation, b: Conversation) => (Number(b.createdAt ?? 0)) - (Number(a.createdAt ?? 0)));
        set({ conversations: sortedConversations });

        return sortedConversations;
      } catch (err) {
        console.error("Fetch conversations failed", err);
      }
    },

    activeConversation: null,
    setActiveConversation: (conversation) => set({ activeConversation: conversation }),

    activeMessages: [],
    setActiveMessages: (messages) => set({ activeMessages: messages }),
    getActiveMessages: () => get().activeMessages,
    fetchActiveMessages: async (conversationId: number) => {
      try {
        const { contractView } = useFHEZamaTalkStore.getState();
        const messages = await contractView?.getMessages(conversationId)

        return messages
      } catch (err) {
        console.error("Get active messages failed", err);
        return []
      }
    },
    sendMessage: async (messageEnc, reactionEnc) => {
      try {
        const { activeConversation } = get()
        const { profile } = useFHEZamaTalkLoginStore.getState();
        const { contractTx } = useFHEZamaTalkStore.getState();
        const to = profile?.wallet?.toLowerCase() === activeConversation?.sender?.toLowerCase() ? activeConversation?.receiver : activeConversation?.sender;

        const tx = await contractTx?.sendMessage(to, messageEnc.ciphertexts, messageEnc.proofs, reactionEnc.ciphertext, reactionEnc.proof)
        await tx.wait();
      } catch (err) {
        console.error("Send message failed", err);
      }
    },
    fetchMessage: async (messageId) => {
      try {
        const { contractTx } = useFHEZamaTalkStore.getState();
        const message = await contractTx?.getMessage(messageId)

        return message
      } catch (err) {
        console.error("Fetch message failed", err);
      }
    },
    reactionMessage: async (messageId, reactionEnc): Promise<boolean> => {
      try {
        const { contractTx } = useFHEZamaTalkStore.getState();
        await contractTx?.changeReaction(messageId, reactionEnc.ciphertext, reactionEnc.proof)
        return true
      } catch (err) {
        console.error("Fetch message failed", err);
        return false
      }
    }
  }));
