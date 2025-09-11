import React from "react";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";
import Avatar from "@/components/shared/Avatar";

const ChatHeader: React.FC = () => {
  return (
    <header className="h-[90px] zama-bg-gradient flex items-center justify-between px-6 shadow-lg border-b border-yellow-300">
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

      <div className="flex flex-1 justify-center px-6">
        <div className="relative max-w-[500px]" style={{ width: "-webkit-fill-available" }}>
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base" />
          <input
            type="text"
            placeholder="Add Friend by Address or Name ..."
            className="w-full h-[45px] pl-11 pr-4 rounded-full border border-yellow-400 text-base shadow-sm focus:ring-2 focus:ring-yellow-500 outline-none transition"
          />
        </div>
      </div>

      <div className="hover:scale-105 transition-transform duration-300 cursor-pointer ring-2 ring-white shadow-lg rounded-[20px]">
        <Avatar name={"Jony Nguyen"} />
      </div>
    </header>
  );
};

export default ChatHeader;
