import React from "react";
import classNames from "classnames";

import {
  ConversationHeader,
  MessageList,
  MessageInput,
  InputToolbox,
} from "@chatscope/chat-ui-kit-react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({
  children,
  className,
  ...rest
}) => {
  const cName = "cs-chat-container";

  const allowedTypes = [
    ConversationHeader,
    MessageList,
    MessageInput,
    InputToolbox,
  ];
  const childrenArray = React.Children.toArray(children);

  const libChildren = childrenArray.filter((child: any) =>
    allowedTypes.includes(child?.type)
  );
  const customChildren = childrenArray.filter(
    (child: any) => !allowedTypes.includes(child?.type)
  );

  return (
    <div {...rest} className={classNames(cName, className)}>
      {libChildren}
      {customChildren}
    </div>
  );
};

export default Container;
