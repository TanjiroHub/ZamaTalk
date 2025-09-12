import React, { useState } from "react";
import Image from "next/image";
import Avatar from "@/components/shared/Avatar";
import Conversation from "@/components/shared/Conversation";
import { FaSearch } from "react-icons/fa";
import { ConversationList } from "@chatscope/chat-ui-kit-react";

type User = {
  id: number;
  name: string;
  address: string;
};

const ChatHeader: React.FC = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const [users] = useState<User[]>([
    { id: 1, name: "Alice Johnson", address: "0x12a3...89ff" },
    { id: 2, name: "Bob Smith", address: "0xabcd...22ff" },
    { id: 3, name: "Charlie Nguyen", address: "0x99ff...bb77" },
    { id: 3, name: "Charlie Nguyen", address: "0x99ff...bb77" },
    { id: 3, name: "Charlie Nguyen", address: "0x99ff...bb77" },
    { id: 3, name: "Charlie Nguyen", address: "0x99ff...bb77" },
    { id: 3, name: "Charlie Nguyen", address: "0x99ff...bb77" },
    { id: 3, name: "Charlie Nguyen", address: "0x99ff...bb77" },
    { id: 3, name: "Charlie Nguyen", address: "0x99ff...bb77" },
    { id: 3, name: "Charlie Nguyen", address: "0x99ff...bb77" },
    { id: 3, name: "Charlie Nguyen", address: "0x99ff...bb77" },
    { id: 3, name: "Charlie Nguyen", address: "0x99ff...bb77" },
    { id: 3, name: "Charlie Nguyen", address: "0x99ff...bb77" },
  ]);

  const filtered = query
    ? users.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <header className="chat-header h-[90px] zama-bg-gradient flex items-center justify-between px-6 shadow-lg border-b border-yellow-300">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Image
          src="/zama-logo.svg"
          alt="Zama Logo"
          width={150}
          height={150}
          priority
          className="hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Search */}
      <div className="flex flex-1 justify-center px-6">
        <div className="relative max-w-[500px] w-full group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base" />
          <input
            type="text"
            value={query}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Add Friend by Address or Name ..."
            className="w-full h-[45px] pl-11 pr-4 rounded-[10px] border text-base shadow-sm focus:ring-2 focus:ring-yellow-500 outline-none transition"
          />

          {/* Suggestion List */}
          {isFocused && filtered.length > 0 && (
            <div className="h-auto absolute left-0 right-0 overflow-hidden mt-1 rounded-xl shadow-lg border bg-white z-50">
              <ConversationList>
                {filtered.map((bot) => (
                  <Conversation key={bot.id} name={bot.name} info={bot.address}>
                    <Avatar name={bot.name} />
                  </Conversation>
                ))}
              </ConversationList>
            </div>
          )}
        </div>
      </div>

      {/* Avatar Profile + Dropdown */}
      <div className="relative group">
        <div className="hover:scale-105 transition-transform duration-300 cursor-pointer ring-2 ring-white shadow-lg rounded-[20px]">
          <Avatar name={"Jony Nguyen"} />
        </div>

        <div className="hidden group-hover:block absolute right-0 mt-3 w-[300px] rounded-[12px] shadow-lg bg-white z-50">
          <div className="absolute -top-6 right-0 h-6 w-full bg-transparent" />

          <div className="p-4 flex flex-col">
            <div className="flex justify-center">
              <Avatar name={"Jony Nguyen"} />
            </div>

            <div className="mt-3 space-y-4">
              <div className="flex items-center">
                <p className="text-xs text-gray-400 min-w-[80px]">User Name:</p>
                <p className="font-semibold text-gray-800">Jony Nguyen</p>
              </div>

              <div className="flex items-center">
                <p className="text-xs text-gray-400 min-w-[80px]">Address:</p>
                <p className="text-sm text-gray-500 truncate">0x12a3...89ffff</p>
              </div>

              <div className="flex items-center">
                <p className="text-xs text-gray-400 min-w-[80px]">Balance:</p>
                <p className="text-[#ffd200] font-medium">2.34 ETH</p>
              </div>
            </div>

            <button className="mt-6 w-full px-4 py-2 rounded-[8px] bg-yellow-300 hover:[background-color:#ffd200] text-gray-600 font-semibold transition cursor-pointer">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
