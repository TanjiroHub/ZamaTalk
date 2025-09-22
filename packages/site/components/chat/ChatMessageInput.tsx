import React, { useState } from "react";
import { MessageInput } from "@chatscope/chat-ui-kit-react";
import { encryptChunksForContract } from "@/services";
import { useFHEZamaTalkStore } from "@/store/useFHEZamaTalkStore";
import { useMetaMaskEthersSigner } from "@/hooks/metamask/useMetaMaskEthersSigner";
import { useFHEZamaTalkConversationStore } from "@/store/useFHEZamaTalkConversationStore";

const ChatMessageInput: React.FC = () => {
  const [value, setValue] = useState("");

  const { ethersSigner } = useMetaMaskEthersSigner();
  const { fheInstance, contractAddress } = useFHEZamaTalkStore();
  const { activeMessages, setLoading, sendMessage, setActiveMessages, fetchConversations } = useFHEZamaTalkConversationStore();

  function handleChange(text: string) {
    setValue(text);
  }

  async function handleSubmit(message: string) {
    if (contractAddress && fheInstance && ethersSigner) {
      setValue('');
      setLoading(true);
      const messsaheEnc = await encryptChunksForContract(contractAddress, fheInstance, ethersSigner, message);
      await sendMessage(messsaheEnc);
      fetchConversations();
      setActiveMessages([...activeMessages, {
        id: 0,
        content: message,
        createdAt: Date.now(),
        direction: "outgoing",
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
