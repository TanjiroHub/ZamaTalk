import React from "react";
import Avatar from "@/components/shared/Avatar";
import Conversation from "@/components/shared/Conversation";
import { ConversationList } from "@chatscope/chat-ui-kit-react";
import { Conversation as ConversationType } from "@/types";

const bots: ConversationType[] = [
  {
    id: "lilly",
    name: "Bot Lilly",
    info: "Talk to me....",
  },
  {
    id: "eliot",
    name: "Bot Eliot",
    info: "I'm a good listener",
  },
  {
    id: "mia",
    name: "Bot Mia",
    info: "Need advice? I'm here",
  },
  {
    id: "jack",
    name: "Bot Jack",
    info: "Always ready for a chat",
  },
];

const ChatBotConversationList: React.FC = () => {
  return (
    <ConversationList>
      {bots.map((bot) => (
        <Conversation key={bot.id} name={bot.name} info={bot.info}>
          <Avatar name={bot.name} />
        </Conversation>
      ))}
    </ConversationList>
  );
};

export default ChatBotConversationList;
