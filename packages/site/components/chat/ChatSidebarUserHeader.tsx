import React from "react";
import { Avatar } from "@chatscope/chat-ui-kit-react";
import { FaSignOutAlt } from "react-icons/fa";

const ChatSidebarUserHeader: React.FC = () => {
  const userName = "Tanjiro Hub";

  return (
    <div className="flex items-center justify-between px-3 py-2 border-b">
      <div className="flex items-center gap-3">
        <Avatar name={userName} status="available" />
        <div className="font-medium">{userName}</div>
      </div>

      <button aria-label="Logout" className="p-2 rounded hover:bg-gray-100">
        <FaSignOutAlt />
      </button>
    </div>
  );
};

export default ChatSidebarUserHeader;
