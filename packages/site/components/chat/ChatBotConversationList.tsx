import React, { useEffect } from "react";
import Avatar from "@/components/shared/Avatar";
import Conversation from "@/components/shared/Conversation";
import { ConversationList } from "@chatscope/chat-ui-kit-react";
import { Conversation as ConversationType } from "@/types";
import { useFHEZamaTalkConversationStore } from "@/store/useFHEZamaTalkConversationStore";

const ChatBotConversationList: React.FC = () => {
  const { activeConversation, conversations, setActiveConversation, } = useFHEZamaTalkConversationStore();

  function handleAddFriend(conversation: ConversationType): void {
    setActiveConversation(conversation);
  }

  return (
    <ConversationList>
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          onClick={() => handleAddFriend(conversation)}
        >
          <Conversation
            key={conversation.id}
            name={conversation.name}
            info={conversation.createdAt}
            active={activeConversation?.id === conversation.id}
          >
            <Avatar name={conversation.name} />
          </Conversation>
        </div>
      ))}
    </ConversationList>
  );
};

export default ChatBotConversationList;
