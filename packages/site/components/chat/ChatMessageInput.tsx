import React, { useState } from "react";
import { MessageInput } from "@chatscope/chat-ui-kit-react";
import { ReactionType } from "@/types";
import { encryptChunksForContract, encryptStringForContract } from "@/services";
import { useFHEZamaTalkStore } from "@/store/useFHEZamaTalkStore";
import { useMetaMaskEthersSigner } from "@/hooks/metamask/useMetaMaskEthersSigner";
import { useFHEZamaTalkConversationStore } from "@/store/useFHEZamaTalkConversationStore";

const ChatMessageInput: React.FC = () => {
  const [value, setValue] = useState("");

  const { ethersSigner, acount } = useMetaMaskEthersSigner();
  const { fheInstance, contractAddress } = useFHEZamaTalkStore();
  const { activeMessages, setLoading, sendMessage, setActiveMessages, fetchConversations } = useFHEZamaTalkConversationStore();

  function handleChange(text: string) {
    setValue(text);
  }

  async function handleSubmit(message: string) {
    if (contractAddress && fheInstance && ethersSigner) {
      setValue('');
      setLoading(true);
      const messsagesEnc = await encryptChunksForContract(contractAddress, fheInstance, ethersSigner, message);
      const reactionEnc = await encryptStringForContract(contractAddress, fheInstance, ethersSigner, String(ReactionType.NONE));
      await sendMessage(messsagesEnc, reactionEnc);
      fetchConversations();
      setActiveMessages([...activeMessages, {
        id: 0,
        sender: '',
        content: message,
        createdAt: Date.now(),
        direction: "outgoing",
        reaction: ReactionType.NONE,
      }]);
      setLoading(false);
    }
  }

  return (
    <MessageInput
      placeholder="Type message here"
      attachButton={false}
      value={value}
      onChange={handleChange}
      onSend={handleSubmit}
    />
  );
};

export default ChatMessageInput;
