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
  setActiveConversation: (conversation: Conversation | null) => void;

  activeMessages: Message[];
  setActiveMessages: (messages: Message[]) => void;
  getActiveMessages: () => Message[];
  fetchActiveMessages: (id: number) => Promise<EncryptedMessage[] | void>;
  sendMessage: (message: { ciphertexts: Uint8Array[]; proofs: Uint8Array[] }) => Promise<void>;
};

export const useFHEZamaTalkConversationStore =
  create<ZamaTalkConversationStore>((set, get) => ({
    loading: false,
    setLoading: (value: boolean) => set({ loading: value }),

    conversations: [],
    setConversations: (convos) => set({ conversations: convos }),
    addConversation: (convo) => set((s) => ({ conversations: [...s.conversations, convo] })),
    fetchConversations: async () => {
      try {
        const { contractTx } = useFHEZamaTalkStore.getState();
        const { profile } = useFHEZamaTalkLoginStore.getState();

        const conversations = await contractTx?.myConversations(profile?.wallet);
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
        const { contractTx } = useFHEZamaTalkStore.getState();
        const messages = await contractTx?.getMessages(conversationId)

        return messages
      } catch (err) {
        console.error("Get active messages failed", err);
      }
    },
    sendMessage: async (messageEnc) => {
      try {
        const { activeConversation } = get()
        const { profile } = useFHEZamaTalkLoginStore.getState();
        const { contractTx } = useFHEZamaTalkStore.getState();
        const to = profile?.wallet?.toLowerCase() === activeConversation?.sender?.toLowerCase() ? activeConversation?.receiver : activeConversation?.sender;

        const tx = await contractTx?.sendMessage(to, messageEnc.ciphertexts, messageEnc.proofs)
        await tx.wait();
      } catch (err) {
        console.error("Send message failed", err);
      }
    },
  }));
