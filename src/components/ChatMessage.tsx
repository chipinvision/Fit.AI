import React from "react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  isBot: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, isBot }) => {
  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-fade-in",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-4",
          isBot
            ? "bg-secondary text-secondary-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;