"use client";

import "@/styles/chat.scss";

import React, { useEffect } from "react";
import ChatContainer from "@/components/shared/Container";
import { ClipLoader } from "react-spinners";
import { Sidebar, MainContainer } from "@chatscope/chat-ui-kit-react";

import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatMessageInput from "@/components/chat/ChatMessageInput";
import ChatMessageHeader from "@/components/chat/ChatMessageHeader";
import ChatBotConversationList from "@/components/chat/ChatBotConversationList";

import { useFheInstance } from "@/hooks/useFHEZamaTalk";
import { useFHEZamaTalkStore } from "@/store/useFHEZamaTalkStore";
import { useFHEZamaTalkConversationStore } from "@/store/useFHEZamaTalkConversationStore";

const Chat: React.FC = () => {
  useFheInstance()
  const { contractTx,fhevmIsReady } = useFHEZamaTalkStore();
  const { loading, conversations, activeConversation, fetchConversations } = useFHEZamaTalkConversationStore();

  useEffect(() => void fetchConversations(), []);

  useEffect(() => {
    async function handler(): Promise<void> {
      if (conversations.length === 0) await fetchConversations();
    }

    contractTx?.on("MessageSent", handler);
    return () => {
      contractTx?.off("MessageSent", handler);
    };
  }, []);

  const renderSidebar = () => {
    if (conversations.length === 0) return null;

    return (
      <Sidebar position="left">
        <ChatBotConversationList />
      </Sidebar>
    );
  };

  const renderChatContent = () => {
    if (conversations.length === 0) {
      return (
        <p className="empty-state">No conversations yet. Start a new chat!</p>
      );
    }

    if (activeConversation === null) {
      return (
        <p className="empty-state">
          Please select a conversation to start chatting!
        </p>
      );
    }

    return (
      <ChatContainer>
        <ChatMessageHeader />
        <ChatMessages />
        <ChatMessageInput />
      </ChatContainer>
    );
  };

  return (
    <div className="h-full">
      <ChatHeader />

      <MainContainer>
        {renderSidebar()}
        {renderChatContent()}
      </MainContainer>

      {(!fhevmIsReady || loading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <ClipLoader
            color="#fef9c3"
            loading={!fhevmIsReady || loading}
            size={45}
            aria-label="Loading Spinner"
          />
        </div>
      )}
    </div>
  );
};

export default Chat;
