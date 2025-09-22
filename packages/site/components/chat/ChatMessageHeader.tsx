import React from "react";
import Avatar from "@/components/shared/Avatar";
import { Conversation } from "@/types";
import { useMetaMaskEthersSigner } from "@/hooks/metamask/useMetaMaskEthersSigner";
import { useFHEZamaTalkConversationStore } from "@/store/useFHEZamaTalkConversationStore";

const ChatMessageHeader: React.FC = () => {
  const { acount } = useMetaMaskEthersSigner();
  const { activeConversation } = useFHEZamaTalkConversationStore();

  function getConversationDisplayName(acount: string | undefined, conversation: Conversation | null): string {
    return (acount?.toLowerCase() === conversation?.receiver?.toLowerCase()
      ? conversation?.senderName
      : conversation?.receiverName) ?? "";
  }

  return (
    <section className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white shadow-sm border border-gray-100">
      <Avatar name={getConversationDisplayName(acount, activeConversation)} />
      <div className="font-semibold text-gray-800">
        {getConversationDisplayName(acount, activeConversation)}
      </div>
    </section>
  );
};

export default ChatMessageHeader;
