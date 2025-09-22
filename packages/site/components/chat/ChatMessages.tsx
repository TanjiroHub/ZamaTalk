import React, { useEffect } from "react";
import { MessageList, Message } from "@chatscope/chat-ui-kit-react";

import { FhevmDecryptionSignature } from "../../../fhevm-react/FhevmDecryptionSignature";
import { useFHEZamaTalkConversationStore } from "@/store/useFHEZamaTalkConversationStore";
import { useFHEZamaTalkStore } from "@/store/useFHEZamaTalkStore";
import { useMetaMaskEthersSigner } from "@/hooks/metamask/useMetaMaskEthersSigner";
import { decryptHandles } from "@/services";
import { renderTime, bigIntToString } from "@/utils";

import { Message as MessageType, EncryptedMessage } from "@/types";

const ChatMessages: React.FC = () => {
  const { acount, ethersSigner } = useMetaMaskEthersSigner();
  const {
    contractTx,
    fheInstance,
    contractAddress,
    fhevmDecryptionSignatureStorage,
  } = useFHEZamaTalkStore();
  const {
    activeConversation,
    activeMessages,
    getActiveMessages,
    fetchActiveMessages,
    setActiveMessages,
    setActiveConversation,
    fetchConversations,
    setLoading,
  } = useFHEZamaTalkConversationStore();

  async function decryptMessages(messages: EncryptedMessage[]): Promise<MessageType[] | null> {
    if (contractAddress && fheInstance && ethersSigner) {
      const sig = await FhevmDecryptionSignature.loadOrSign(
        fheInstance,
        [contractAddress],
        ethersSigner,
        fhevmDecryptionSignatureStorage
      );
      if (!sig) return null;

      const handles = messages?.flatMap((m: any) => [...m.content.map((h: Uint8Array) => ({ handle: h, contractAddress, })),]) ?? [];
      const decryptedHandles = await decryptHandles(fheInstance, handles ?? [], sig);

      return messages.map((m) => ({
        id: Number(m.id),
        createdAt: Number(m.createdAt),
        sender: String(m.sender),
        content: m.content.map((h: any) => bigIntToString(BigInt(decryptedHandles[h]))).join(""),
        direction: String(m.sender).toLowerCase() === acount?.toLowerCase() ? "outgoing" : "incoming",
      }));
    }

    return [];
  }

  useEffect(() => {
    async function loadMessages() {
      setLoading(true);
      const encryptMessages = await fetchActiveMessages(activeConversation?.id ?? 0);
      const decryptMessage = await decryptMessages(encryptMessages ?? []);
      if (decryptMessage === null) {
        setActiveConversation(null)
        setActiveMessages([]);
      } else {
        setActiveMessages(decryptMessage);
      }
      setLoading(false);
    }

    if (activeConversation?.id) {
      loadMessages();
    }
  }, [activeConversation]);

  useEffect(() => {
    async function handler(messageId: number, conversationId: number, from: string, to: string) {
      if (to?.toLowerCase() === acount?.toLowerCase() && activeConversation?.id === conversationId) {
        const encryptMessages = await fetchActiveMessages(conversationId);
        const lastMessage = encryptMessages?.[encryptMessages.length - 1];
        const decryptMessage = await decryptMessages(lastMessage ? [lastMessage] : []);
        if (decryptMessage !== null) setActiveMessages([...getActiveMessages(), ...decryptMessage]);
      }
      fetchConversations()
    }

    contractTx?.on("MessageSent", handler);

    return () => {
      contractTx?.off("MessageSent", handler);
    };
  }, [contractTx]);

  return (
    <MessageList>
      {activeMessages.map((msg, index) => {
        const nextMsg = activeMessages[index + 1];
        const isLastInGroup = !nextMsg || nextMsg.sender !== msg.sender || nextMsg.direction !== msg.direction;

        return (
          <Message
            key={msg.id}
            model={{
              message: msg.content,
              sender: msg.sender,
              direction: msg.direction as "incoming" | "outgoing",
              position: "single",
            }}
          >
            {isLastInGroup && (
              <Message.Footer>
                <span className="text-xs text-gray-400 mt-[4px]">
                  {renderTime(msg.createdAt ?? 0)}
                </span>
              </Message.Footer>
            )}
          </Message>
        );
      })}
    </MessageList>
  );
};

export default ChatMessages;
