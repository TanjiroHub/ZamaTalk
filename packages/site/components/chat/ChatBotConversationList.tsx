import React, { useEffect } from "react";
import Avatar from "@/components/shared/Avatar";
import Conversation from "@/components/shared/Conversation";
import { renderTime } from '@/utils'
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
            name={conversation.receiverName}
            info={renderTime(conversation.createdAt ?? 0)}
            active={activeConversation?.id === conversation.id}
          >
            <Avatar name={conversation.receiverName ?? ''} />
          </Conversation>
        </div>
      ))}
    </ConversationList>
  );
};

export default ChatBotConversationList;
