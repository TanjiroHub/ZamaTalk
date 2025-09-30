import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
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

  const [search, setSearch] = useState("");

  function handleChatting(conversation: ConversationType): void {
    setActiveConversation(conversation);
  }

  function getConversationDisplayName(acount: string | undefined, conversation: ConversationType): string {
    return (acount?.toLowerCase() === conversation.receiver?.toLowerCase()
      ? conversation.senderName
      : conversation.receiverName) ?? "";
  }

  const filteredConversations = conversations.filter((conversation) => {
    const name = getConversationDisplayName(acount, conversation);
    return name.toLowerCase().includes(search.toLowerCase());
  });


  return (
    <section>
      <div className="flex items-center gap-2 px-3 py-[10.4px] border-b bg-white">
        <div className="flex-1">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#FFD200] text-sm text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
      </div>
      <ConversationList>
        {filteredConversations.map((conversation) => (
          <div key={conversation.id} onClick={() => handleChatting(conversation)}>
            <Conversation
              key={conversation.id}
              name={getConversationDisplayName(acount, conversation)}
              info={renderTime(conversation.createdAt ?? 0)}
              active={Number(activeConversation?.id) === Number(conversation.id)}
            >
              <Avatar name={getConversationDisplayName(acount, conversation)} />
            </Conversation>
          </div>
        ))}
      </ConversationList>
    </section>
  );
};

export default ChatBotConversationList;
