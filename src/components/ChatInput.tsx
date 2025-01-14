import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Upload } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onImageUploadClick?: () => void;
  isLoading?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, onImageUploadClick, isLoading }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask a question..." 
        disabled={isLoading}
        className="flex-1 bg-white/50 backdrop-blur-sm border-primary/20 focus-visible:ring-primary rounded-xl"
      />
      <Button 
        type="button"
        onClick={onImageUploadClick}
        disabled={isLoading}
        className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200"
      >
        <Upload className="h-4 w-4" />
      </Button>
      <Button 
        type="submit"
        disabled={isLoading || !message.trim()} 
        className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200"
      > 
        {isLoading ? (
          <span className="flex items-center justify-center">
            <span className="animate-pulse bg-white rounded-full w-2 h-2 mr-1"></span>
            <span className="animate-pulse bg-white rounded-full w-2 h-2 mr-1"></span>
            <span className="animate-pulse bg-white rounded-full w-2 h-2"></span>
          </span>
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};

export default ChatInput;