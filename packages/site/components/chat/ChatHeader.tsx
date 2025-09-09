import React from "react";
import Avatar from "@/components/shared/Avatar";
import { FaSignOutAlt } from "react-icons/fa";

interface ChatHeaderProps {
  name: string;
  avatar?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ name, avatar }) => {
  return (
    <section className="flex items-center justify-between gap-3 cs-conversation-header">
      <div className="flex items-center gap-3">
        <Avatar name={name} />
        <div className="font-semibold">{name}</div>
      </div>

      <FaSignOutAlt />
    </section>
  );
};

export default ChatHeader;
