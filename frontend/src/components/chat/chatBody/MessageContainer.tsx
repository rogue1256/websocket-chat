import React, { useCallback } from "react";
import { ChatMessage as ChatMessagePayload } from "../../../shared/models/chat";
import { BroadcastMessage } from "./BroadcastMessage";
import { ChatMessage } from "./ChatMessage";

type MessageContainerProps = {
  message: ChatMessagePayload;
};
export const MessageContainer: React.FC<MessageContainerProps> = ({ message }) => {
  const messageRender = useCallback(() => {
    if (message.isBroadcast) {
      return <BroadcastMessage text={message.text} />;
    }

    if (message.isOwn) {
      return <ChatMessage ownMessage={true} text={message.text} />;
    } else {
      return <ChatMessage ownMessage={false} text={message.text} />;
    }
  }, [message]);

  return messageRender();
};
