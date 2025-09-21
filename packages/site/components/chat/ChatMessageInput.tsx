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
  const { setLoading, sendMessage } = useFHEZamaTalkConversationStore();

  function handleChange(text: string) {
    setValue(text);
  }

  async function handleSubmit(message: string) {
    if (contractAddress && fheInstance && ethersSigner) {
      setLoading(true);
      const messsaheEnc = await encryptChunksForContract(contractAddress, fheInstance, ethersSigner, message);
      await sendMessage(messsaheEnc);
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
