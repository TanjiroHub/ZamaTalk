import React from "react";
import { MessageList, Message } from "@chatscope/chat-ui-kit-react";

export const mockMessages = [
  {
    id: 1,
    sender: "[Bot] Lilly",
    message: "Hi tyth!",
    sentTime: "just now",
    direction: "incoming",
  },
  {
    id: 2,
    sender: "[Bot] Lilly",
    message: "I'm not really a bot 😁",
    sentTime: "just now",
    direction: "incoming",
  },
  {
    id: 3,
    sender: "You",
    message: "Haha, really?",
    sentTime: "1 min ago",
    direction: "outgoing",
  },
];

const ChatMessages: React.FC = () => {
  return (
    <MessageList>
      {mockMessages.map((msg) => (
        <Message
          key={msg.id}
          model={{
            message: msg.message,
            sentTime: msg.sentTime,
            sender: msg.sender,
            direction: msg.direction as "incoming" | "outgoing",
            position: "single",
          }}
        />
      ))}
    </MessageList>
  );
};

export default ChatMessages;
