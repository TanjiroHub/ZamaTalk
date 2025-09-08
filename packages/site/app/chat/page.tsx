"use client";

import React from "react";
import {
  MainContainer,
  Sidebar,
  ChatContainer,
} from "@chatscope/chat-ui-kit-react";

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

        <ChatContainer></ChatContainer>
      </MainContainer>
    </div>
  );
};

export default Chat;
