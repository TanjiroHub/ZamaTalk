import React from "react";
import { FaPlus, FaSearch } from "react-icons/fa";

const ChatSidebarUserHeader: React.FC = () => {
  return (
    <div className="flex items-center gap-2 px-3 py-[10.4px] border-b bg-white">
      <div className="flex-1">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full h-9 pl-9 pr-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD200] text-sm text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* <button
        aria-label="Add user"
        className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FFD200] text-black shadow hover:bg-yellow-400 transition-colors"
      >
        <FaPlus size={16} />
      </button> */}
    </div>
  );
};

export default ChatSidebarUserHeader;
