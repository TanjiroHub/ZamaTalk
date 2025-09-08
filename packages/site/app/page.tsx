"use client";

import "@/styles/login.scss";

import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { Button } from "@chatscope/chat-ui-kit-react";

import Image from "next/image";

const Login: React.FC = () => {
  const [name, setName] = useState("");

  function onLogin() {}

  return (
    <div className="zama-bg h-screen flex items-center justify-center bg-white">
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

        <div className="flex items-center border border-gray-300 rounded mb-4 overflow-hidden h-11 bg-white">
          <div className="px-3 text-gray-500 flex items-center">
            <FaUser size={14} />
          </div>
          <input
            type="text"
            value={name}
            placeholder="Your name"
            className="w-full px-3 py-2 focus:outline-none text-gray-700 text-sm"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <Button
          disabled={!name.trim()}
          className="w-full h-11 bg-blue-500 text-white font-medium rounded mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onLogin}
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default Login;
