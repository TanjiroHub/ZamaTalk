import { create } from "zustand";
import { Message, Conversation } from "@/types";

type ZamaTalkConversationStore = {
  loading: boolean,
  setLoading: (value: boolean) => void

  conversations: Conversation[];
  addConversation: (convo: Conversation) => void;
  setConversations: (convos: Conversation[]) => void;
  fetchConversations: () => Promise<Conversation[] | void>;

  activeConversation: Conversation | null;
  setActiveConversation: (conversation: Conversation | null) => void;

  activeMessage: Message[];
  setActiveMessage: (messages: Message[]) => void;
  getActiveMessage: (id: string) => Promise<Message[] | void>;
  sendMessage: (convoId: string, from: string, to: string, content: string) => Promise<void>;
};

export const useFHEZamaTalkConversationStore = create<ZamaTalkConversationStore>(
  (set, get) => ({
    loading: false,
    setLoading: (value: boolean) => set({ loading: value }),

    conversations: [],
    setConversations: (convos) => set({ conversations: convos }),
    addConversation: (convo) => set((s) => ({ conversations: [...s.conversations, convo] })),
    fetchConversations: async () => {
      try {
      } catch (err) {
        console.error("Fetch conversations failed", err);
      }
    },

    activeConversation: null,
    setActiveConversation: (conversation) => set({ activeConversation: conversation }),

    activeMessage: [],
    setActiveMessage: (messages) => set({ activeMessage: messages }),
    getActiveMessage: async (id) => {
      try {
      } catch (err) {
        console.error("Get active messages failed", err);
      }
    },
    sendMessage: async (convoId, from, to, content) => {
      try {
      } catch (err) {
        console.error("Send message failed", err);
      }
    },
  })
);
