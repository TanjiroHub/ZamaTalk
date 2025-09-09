import React from "react";
import Avatar from "@/components/shared/Avatar";
import { FaPlus } from "react-icons/fa";

const ChatSidebarUserHeader: React.FC = () => {
  const userName = "Tanjiro Hub";

  return (
    <div className="flex items-center justify-between px-3 py-[9.5px] border-b">
      <div className="flex items-center gap-3">
        <Avatar name={userName} />
        <div className="font-semibold">{userName}</div>
      </div>

      <button aria-label="Logout" className="p-2 rounded hover:bg-gray-100">
        <FaPlus />
      </button>
    </div>
  );
};

export default ChatSidebarUserHeader;
