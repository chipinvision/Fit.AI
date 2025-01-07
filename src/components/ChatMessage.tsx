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
        "flex w-full animate-fade-in",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl p-4 relative group shadow-sm",
          isBot
            ? "bg-white/80 backdrop-blur-sm text-gray-800 hover:bg-white/90"
            : "bg-primary text-primary-foreground"
        )}
      >
        <p className="whitespace-pre-wrap">{content}</p>
        {isBot && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-primary/10"
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