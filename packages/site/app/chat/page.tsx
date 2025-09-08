"use client";

import React from "react";
import {
  MainContainer,
  Sidebar,
  ChatContainer,
} from "@chatscope/chat-ui-kit-react";

import ChatSidebarUserHeader from "@/components/chat/ChatSidebarUserHeader";

const Chat: React.FC = () => {
  return (
    <div className="h-full">
      <MainContainer>
        <Sidebar position="left">
          <ChatSidebarUserHeader />
        </Sidebar>

        <ChatContainer></ChatContainer>
      </MainContainer>
    </div>
  );
};

export default Chat;
