import React from "react";
import Avatar from "@/components/shared/Avatar";

interface ChatHeaderMessageProps {
  name: string;
  avatar?: string;
}

const ChatMessageHeader: React.FC<ChatHeaderMessageProps> = ({ name, avatar }) => {
  return (
    <section className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white shadow-sm border border-gray-100">
      <Avatar name={name} src={avatar} />
      <div className="font-semibold text-gray-800">{name}</div>
    </section>
  );
};

export default ChatMessageHeader;
