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
      {mockMessages.map((msg, index) => {
        const nextMsg = mockMessages[index + 1];
        const isLastInGroup = !nextMsg || nextMsg.sender !== msg.sender || nextMsg.direction !== msg.direction;

        return (
          <Message
            key={msg.id}
            model={{
              message: msg.message,
              sender: msg.sender,
              direction: msg.direction as "incoming" | "outgoing",
              position: "single",
            }}
          >
            {isLastInGroup && (
              <Message.Footer>
                <span className="text-xs text-gray-400">{msg.sentTime}</span>
              </Message.Footer>
            )}
          </Message>
        );
      })}
    </MessageList>
  );
};

export default ChatMessages;
