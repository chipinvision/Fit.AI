import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { generateResponse } from "@/services/chatService";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  content: string;
  isBot: boolean;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial bot message
  useEffect(() => {
    const sendInitialMessage = async () => {
      setIsLoading(true);
      try {
        const response = await generateResponse([], "YOUR_GEMINI_API_KEY");
        setMessages([{ content: response, isBot: true }]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to start the conversation. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    sendInitialMessage();
  }, []);

  const handleSendMessage = async (content: string) => {
    const newMessage = { content, isBot: false };
    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await generateResponse(
        [...messages, newMessage],
        "YOUR_GEMINI_API_KEY"
      );
      setMessages((prev) => [...prev, { content: response, isBot: true }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-primary p-4">
        <h1 className="text-2xl font-bold text-primary-foreground text-center">
          FitBot - Your Personal Trainer
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              content={message.content}
              isBot={message.isBot}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="p-4 border-t bg-white">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      </footer>
    </div>
  );
};

export default Index;