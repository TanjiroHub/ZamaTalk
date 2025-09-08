import React from "react";
interface ConversationProps {
  name?: React.ReactNode;
  info?: React.ReactNode;
  children?: React.ReactNode;
}

const Conversation: React.FC<ConversationProps> = ({
  name,
  info,
  children,
}) => {
  return (
    <div className={"cs-conversation flex items-center"}>
      {children && <div className="mr-[12px]">{children}</div>}

      <div className="cs-conversation__content">
        {name && <div className="cs-conversation__name">{name}</div>}
        {info && <span className="cs-conversation__info">{info}</span>}
      </div>
    </div>
  );
};

export default Conversation;
