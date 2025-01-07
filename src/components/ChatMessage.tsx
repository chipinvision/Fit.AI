import React from "react";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessageProps {
  content: string;
  isBot: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, isBot }) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        description: "Message copied to clipboard",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to copy message",
      });
    }
  };

  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-fade-in",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-4 relative group",
          isBot
            ? "bg-primary/10 text-primary hover:bg-primary/20"
            : "bg-primary text-primary-foreground"
        )}
      >
        <p className="whitespace-pre-wrap">{content}</p>
        {isBot && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-primary/20"
            aria-label="Copy message"
          >
            <Copy className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;