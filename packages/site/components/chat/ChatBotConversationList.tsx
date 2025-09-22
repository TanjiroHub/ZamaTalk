import React, { useEffect } from "react";
import Avatar from "@/components/shared/Avatar";
import Conversation from "@/components/shared/Conversation";
import { renderTime } from "@/utils";
import { ConversationList } from "@chatscope/chat-ui-kit-react";
import { Conversation as ConversationType } from "@/types";
import { useMetaMaskEthersSigner } from "@/hooks/metamask/useMetaMaskEthersSigner";
import { useFHEZamaTalkConversationStore } from "@/store/useFHEZamaTalkConversationStore";

const ChatBotConversationList: React.FC = () => {
  const { acount } = useMetaMaskEthersSigner();
  const { activeConversation, conversations, setActiveConversation } = useFHEZamaTalkConversationStore();

  function handleChatting(conversation: ConversationType): void {
    setActiveConversation(conversation);
  }

  function getConversationDisplayName(acount: string | undefined, conversation: ConversationType): string {
    return (acount?.toLowerCase() === conversation.receiver?.toLowerCase()
      ? conversation.senderName
      : conversation.receiverName) ?? "";
  }


  return (
    <ConversationList>
      {conversations.map((conversation) => (
        <div key={conversation.id} onClick={() => handleChatting(conversation)}>
          <Conversation
            key={conversation.id}
            name={getConversationDisplayName(acount, conversation)}
            info={renderTime(conversation.createdAt ?? 0)}
            active={activeConversation?.id === conversation.id}
          >
            <Avatar name={getConversationDisplayName(acount, conversation)} />
          </Conversation>
        </div>
      ))}
    </ConversationList>
  );
};

export default ChatBotConversationList;
