"use client";

import "@/styles/login.scss";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { Button } from "@chatscope/chat-ui-kit-react";
import { useFHEZamaTalkContracts } from "@/hooks/useFHEZamaTalk";
import { useFHEZamaTalkStore } from "@/store/useFHEZamaTalkStore";
import { useFHEZamaTalkLoginStore } from "@/store/useFHEZamaTalkLoginStore";
import { useMetaMaskEthersSigner } from "@/hooks/metamask/useMetaMaskEthersSigner";

const Login: React.FC = () => {
  useFHEZamaTalkContracts();
  const { push } = useRouter();
  const [name, setName] = useState("");

  const { contractIsReady } = useFHEZamaTalkStore();
  const { acount, isConnected, connect, switchToSepoliaNetwork } = useMetaMaskEthersSigner();
  const { loading, error, profile, nameExists, getProfile, createProfile } = useFHEZamaTalkLoginStore();

  async function onLogin(): Promise<void> {
    await switchToSepoliaNetwork();
    if (profile !== null) return push("/chat");
    if (await nameExists(name)) return;
    if (profile === null) {
      await createProfile(name);
      if ((await getProfile()) !== null) push("/chat");
    }
  }

  async function onConnect(): Promise<void> {
    await switchToSepoliaNetwork();
    await connect();
  }

  useEffect(() => {
    async function fetchProfile() {
      const profile = await getProfile();
      setName(profile?.name ?? "");
    }

    fetchProfile();
  }, [contractIsReady]);

  return (
    <div className="login zama-bg h-screen flex items-center justify-center bg-white">
      <div className="w-[400px] text-center px-6 relative">
        <Image
          src="/zama-talk.svg"
          alt="Zama Logo"
          width={120}
          height={120}
          className="absolute top-[-120px] right-0"
        />

        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Login to your account
        </h2>

        <div
          className={`flex items-center border border-gray-300 rounded overflow-hidden h-11 ${profile !== null ? "bg-[#F7F7F7] cursor-not-allowed" : "bg-white"}`}
        >
          <div className="px-3 text-gray-500 flex items-center">
            <FaUser size={14} />
          </div>
          <input
            type="text"
            value={name}
            placeholder="Your name"
            className={`w-full py-2 focus:outline-none text-gray-700 text-sm ${profile !== null ? "cursor-not-allowed text-[#6C7280]" : ""}`}
            disabled={profile !== null || !isConnected}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-500 text-left">{error}</p>
        )}

        <Button
          disabled={Boolean(!name.trim() && acount)}
          className="w-full h-11 text-white font-medium rounded mt-4 disabled:opacity-80 disabled:cursor-not-allowed"
          onClick={acount ? onLogin : onConnect}
        >
          {acount ? "Login" : "Connect Wallet"}
        </Button>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <ClipLoader
            color="#fef9c3"
            loading={loading}
            size={45}
            aria-label="Loading Spinner"
          />
        </div>
      )}
    </div>
  );
};

export default Login;
