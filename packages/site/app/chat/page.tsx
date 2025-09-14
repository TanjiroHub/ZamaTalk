"use client";

import "@/styles/chat.scss";

import React from "react";
import ChatContainer from "@/components/shared/Container";
import { Sidebar, MainContainer } from "@chatscope/chat-ui-kit-react";

import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatMessageInput from "@/components/chat/ChatMessageInput";
import ChatMessageHeader from "@/components/chat/ChatMessageHeader";
import ChatSidebarUserHeader from "@/components/chat/ChatSidebarUserHeader";
import ChatBotConversationList from "@/components/chat/ChatBotConversationList";

import { useFHEZamaTalk } from "@/hooks/useFHEZamaTalk";

const Chat: React.FC = () => {
  useFHEZamaTalk();

  return (
    <div className="h-full">
      <ChatHeader />

      <MainContainer>
        <Sidebar position="left">
          <ChatSidebarUserHeader />
          <ChatBotConversationList />
        </Sidebar>

        <ChatContainer>
          <ChatMessageHeader name="Jony Nguyen" />
          <ChatMessages />
          <ChatMessageInput />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default Chat;
