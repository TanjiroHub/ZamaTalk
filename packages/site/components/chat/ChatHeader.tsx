import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";

import Image from "next/image";
import Avatar from "@/components/shared/Avatar";
import Conversation from "@/components/shared/Conversation";

import { FaSearch } from "react-icons/fa";
import { ConversationList } from "@chatscope/chat-ui-kit-react";
import { useFHEZamaTalkLoginStore } from "@/store/useFHEZamaTalkLoginStore";
import { useMetaMaskEthersSigner } from "@/hooks/metamask/useMetaMaskEthersSigner";
import { useFHEZamaTalkConversationStore } from "@/store/useFHEZamaTalkConversationStore";

import { UserProfile, Conversation as ConversationType } from "@/types";

const ChatHeader: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [balance, setBalance] = useState<string>("");

  const { push } = useRouter();
  const { acount, ethersSigner, disconnect } = useMetaMaskEthersSigner();
  const { profile, profiles, getProfiles } = useFHEZamaTalkLoginStore();
  const { activeConversation, conversations, addConversation, setActiveConversation } = useFHEZamaTalkConversationStore()

  useEffect(() => {
    const getBalance = async () => {
      const balance = await ethersSigner?.provider.getBalance(acount ?? "");
      setBalance(balance ? ethers?.formatEther(balance).slice(0, 5) : "0");
    };
    getBalance();
  }, [ethersSigner]);

  function isConversationExists(conversations: ConversationType[], wallet: string): boolean {
    return conversations.some(
      (c) =>
        c.sender?.toLowerCase() === wallet.toLowerCase() ||
        c.receiver?.toLowerCase() === wallet.toLowerCase()
    );
  }

  function isDifferentFromActive(activeConversation: ConversationType | null, wallet: string): boolean {
    return (
      wallet.toLowerCase() !== activeConversation?.sender?.toLowerCase() &&
      wallet.toLowerCase() !== activeConversation?.receiver?.toLowerCase()
    );
  }


  function handleAddFriend(userProfile: UserProfile): void {
    const convo: ConversationType = {
      id: 0,
      receiverName: userProfile.name,
      info: userProfile.wallet,
      sender: acount,
      receiver: userProfile.wallet,
      createdAt: Date.now(),
      status: 1,
    };

    if (!isConversationExists(conversations, userProfile.wallet)) {
      addConversation(convo);
    }

    if (isDifferentFromActive(activeConversation, userProfile.wallet)) {
      setActiveConversation(convo);
    }
  }

  async function handleSearch(q: string) {
    await getProfiles();
    setQuery(q);
  }

  const onLogout = (): void => {
    disconnect();
  };

  useEffect(() => {
    if (!acount) push("/");
  }, [acount]);

  const filtered = query
    ? profiles.filter((user) => {
      const isNotCurrentUser = user.wallet.toLowerCase() !== profile?.wallet.toLowerCase();
      const nameMatchesQuery = user.name.toLowerCase().includes(query.toLowerCase());
      const walletMatchesQuery = user.wallet.toLowerCase().includes(query.toLowerCase());

      const matchesQuery = nameMatchesQuery || walletMatchesQuery;

      return isNotCurrentUser && matchesQuery;
    })
    : [];

  return (
    <header className="chat-header h-[90px] zama-bg-gradient flex items-center justify-between px-6 shadow-lg border-b border-yellow-300">
      {/* Logo */}
      <div className="flex items-center gap-3 mr-[5px]">
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
            onBlur={() => setTimeout(() => setIsFocused(false), 300)}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Add Friend by Address or Name ..."
            className="w-full h-[45px] pl-11 pr-4 rounded-[10px] border text-base shadow-sm focus:ring-2 focus:ring-yellow-500 outline-none transition"
          />

          {/* Suggestion List */}
          {isFocused && filtered.length > 0 && (
            <div className="h-auto absolute left-0 right-0 overflow-hidden mt-1 rounded-xl shadow-lg border bg-white z-50">
              <ConversationList>
                {filtered.map((userProfile) => (
                  <div key={userProfile.id} onClick={() => handleAddFriend(userProfile)}>
                    <Conversation
                      key={userProfile.id}
                      name={userProfile.name}
                      info={userProfile.wallet}
                    >
                      <Avatar name={userProfile.name} />
                    </Conversation>
                  </div>
                ))}
              </ConversationList>
            </div>
          )}
        </div>
      </div>

      {/* Avatar Profile + Dropdown */}
      <div className="relative group">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-3">
            <div className="w-[40px] h-[40px] hover:scale-105 transition-transform duration-300 cursor-pointer ring-2 ring-white shadow-lg rounded-[20px] overflow-hidden">
              <Avatar name={profile?.name ?? ""} />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-base">{profile?.name}</span>{" "}
              <span className="text-sm text-green-500">Active</span>{" "}
            </div>
          </div>
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
                <p className="font-semibold text-gray-800">{profile?.name}</p>
              </div>

              <div className="flex items-center">
                <p className="text-xs text-gray-400 min-w-[80px]">Address:</p>
                <p className="text-sm text-gray-500 truncate">
                  {profile?.wallet}
                </p>
              </div>

              <div className="flex items-center">
                <p className="text-xs text-gray-400 min-w-[80px]">Balance:</p>
                <p className="text-[#ffd200] font-medium">{balance} ETH</p>
              </div>
            </div>

            <button className="mt-6 w-full px-4 py-2 rounded-[8px] bg-yellow-300 hover:[background-color:#ffd200] text-gray-600 font-semibold transition cursor-pointer" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
