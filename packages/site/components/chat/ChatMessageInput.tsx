import React from "react";
import { MessageInput } from "@chatscope/chat-ui-kit-react";

const ChatMessageInput: React.FC = () => {
  return <MessageInput placeholder="Type message here" attachButton={false} />;
};

export default ChatMessageInput;
