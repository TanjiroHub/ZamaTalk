import React, { useEffect } from "react";
import { FacebookSelector } from "@charkour/react-reactions";
import { MessageList, Message } from "@chatscope/chat-ui-kit-react";

import { FhevmDecryptionSignature } from "../../../fhevm-react/FhevmDecryptionSignature";
import { useFHEZamaTalkConversationStore } from "@/store/useFHEZamaTalkConversationStore";
import { useFHEZamaTalkStore } from "@/store/useFHEZamaTalkStore";
import { useMetaMaskEthersSigner } from "@/hooks/metamask/useMetaMaskEthersSigner";
import { encryptStringForContract, decryptHandles } from "@/services";
import { renderTime, bigIntToString } from "@/utils";

import {
  Message as MessageType,
  EncryptedMessage,
  ReactionType,
  ReactionMap,
} from "@/types";

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
    reactionMessage,
    fetchMessage,
    getActiveConversation,
    getActiveMessages,
    fetchActiveMessages,
    setActiveMessages,
    setActiveConversation,
    fetchConversations,
    setLoading,
  } = useFHEZamaTalkConversationStore();

  async function handleReaction(idx: number, messageId: number, reaction: ReactionType) {
    if (contractAddress && fheInstance && ethersSigner) {
      const messages = getActiveMessages();
      const currentReaction = messages[idx]?.reaction;
      if (currentReaction === reaction) return;

      setLoading(true);
      const reactionEnc = await encryptStringForContract(contractAddress, fheInstance, ethersSigner, reaction);
      const hasChangeReaction = await reactionMessage(messageId, reactionEnc);

      if (hasChangeReaction) {
        const updatedMessages = [...messages];
        updatedMessages[idx] = { ...updatedMessages[idx], reaction };
        setActiveMessages(updatedMessages);
      }

      setLoading(false);
    }
  };

  async function decryptMessages(messages: EncryptedMessage[]): Promise<MessageType[] | null> {
    if (contractAddress && fheInstance && ethersSigner) {
      const sig = await FhevmDecryptionSignature.loadOrSign(
        fheInstance,
        [contractAddress],
        ethersSigner,
        fhevmDecryptionSignatureStorage
      );
      if (!sig) return null;

      const handles = messages?.flatMap((m: any) => [...m.content.map((h: Uint8Array) => ({ handle: h, contractAddress })), { handle: m.reaction, contractAddress },]) ?? [];
      const decryptedHandles = await decryptHandles(fheInstance, handles ?? [], sig);

      return messages.map((m) => ({
        id: Number(m.id),
        createdAt: Number(m.createdAt),
        sender: String(m.sender),
        content: m.content.map((h: any) => bigIntToString(BigInt(decryptedHandles[h]))).join(""),
        direction: String(m.sender).toLowerCase() === acount?.toLowerCase() ? "outgoing" : "incoming",
        reaction: [m.reaction].map((h: any) => bigIntToString(BigInt(decryptedHandles[h]))).join("") as ReactionType,
      }));
    }

    return [];
  }

  useEffect(() => {
    async function loadMessages() {
      setLoading(true);
      const encryptMessages = await fetchActiveMessages(Number(activeConversation?.id) ?? 0);
      const decryptMessage = await decryptMessages(encryptMessages ?? []);

      if (decryptMessage === null) {
        setActiveConversation(null);
        setActiveMessages([]);
      } else {
        setActiveMessages(decryptMessage);
      }

      setLoading(false);
    }

    if (activeConversation?.id) loadMessages()
  }, [activeConversation]);

  useEffect(() => {
    async function handler(messageId: number, conversationId: number, from: string, to: string) {
      if (to?.toLowerCase() === acount?.toLowerCase() && Number(getActiveConversation()?.id) === Number(conversationId)) {
        const encryptMessages = await fetchMessage(messageId);
        const decryptMessage = await decryptMessages(encryptMessages ? [encryptMessages] : []);
        setActiveMessages([...getActiveMessages(), ...(decryptMessage ?? [])]);
      } else if (getActiveConversation()?.id === 0) {
        setActiveConversation({ ...activeConversation, id: Number(conversationId) })
      }
      await fetchConversations();
    }

    contractTx?.on("MessageSent", handler);
    return () => {
      contractTx?.off("MessageSent", handler);
    };
  }, [contractTx]);

  useEffect(() => {
    const handler = async (messageId: number, from: string) => {
      const messages = getActiveMessages();
      const idx = messages.findIndex((m: MessageType) => m.id === Number(messageId));
      if (idx < 0 || from?.toLowerCase() === acount?.toLowerCase()) return;

      const encryptMessages = await fetchMessage(Number(messageId));
      const decryptMessage = await decryptMessages(encryptMessages ? [encryptMessages] : []);

      if (decryptMessage?.length) {
        const updatedMessages = [...messages];
        updatedMessages[idx] = decryptMessage[0];
        setActiveMessages(updatedMessages);
      };
    };

    contractTx?.on("ReactionChanged", handler);
    return () => {
      contractTx?.off("ReactionChanged", handler);
    };
  }, [contractTx]);

  return (
    <MessageList className="chat-message">
      {activeMessages.map((msg: MessageType, index) => {
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
            <Message.Header>
              <div className="reactions">
                <FacebookSelector iconSize={30} onSelect={(reaction) => handleReaction(index, msg.id, reaction as ReactionType)} />
              </div>
              {ReactionMap[msg.reaction] && <div className="reaction">{ReactionMap[msg.reaction]}</div>}
            </Message.Header>

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
