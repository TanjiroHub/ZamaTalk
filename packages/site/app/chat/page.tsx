"use client";

import "@/styles/chat-messages.scss";

import React from "react";
import ChatContainer from "@/components/shared/Container";
import { Sidebar, MainContainer } from "@chatscope/chat-ui-kit-react";

import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatMessageInput from "@/components/chat/ChatMessageInput";
import ChatSidebarUserHeader from "@/components/chat/ChatSidebarUserHeader";
import ChatBotConversationList from "@/components/chat/ChatBotConversationList";

const Chat: React.FC = () => {
  return (
    <div className="h-full">
      <MainContainer>
        <Sidebar position="left">
          <ChatSidebarUserHeader />
          <ChatBotConversationList />
        </Sidebar>

        <ChatContainer>
          <ChatHeader name="Jony Nguyen" />
          <ChatMessages />
          <ChatMessageInput />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default Chat;
