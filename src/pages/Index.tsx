import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { generateResponse } from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";

interface Message {
  content: string;
  isBot: boolean;
}

export const Index = () => {
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { content: "Hey I'm Fit.AI, I'm your virtual trainer always up to help.", isBot: true },
  ]); 

  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { 
    scrollToBottom(); 
  }, [messages]);


  const handleSendMessage = async (content: string) => {
    const newMessage = { content, isBot: false };
    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await generateResponse([...messages, newMessage]);
      setMessages((prev) => [...prev, { content: response, isBot: true }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate response. Please check your API key.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return ( 
    <div className="flex flex-col h-screen bg-gradient-to-br from-primary/5 to-primary-foreground/5">
      <header className="bg-white/80 backdrop-blur-sm border-b border-primary/10 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Fit.AI</h1>
          <a href="https://buymeacoffee.com/invisionchip" target="_blank" rel="noopener noreferrer">
            <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-focus">
              Donate
            </button>
          </a>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 bg-white/10 backdrop-blur-sm animate-fade-in">
        <div className="max-w-3xl mx-auto space-y-4">
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

      <footer className="p-4 bg-white/80 backdrop-blur-sm border-t border-primary/10">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      </footer>

      {showDonateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-lg shadow-lg backdrop-blur-sm">
            <p className="text-lg mb-4">Liked the app? Support the engineers behind this app, by donating a small amount.</p>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowDonateModal(false);
                  localStorage.setItem('donationModalDismissed', 'true');
                }}
                className="px-4 py-2 bg-gray-200 rounded-md mr-4 hover:bg-gray-300"
              >
                Dismiss
              </button>
              <a href="https://buymeacoffee.com/invisionchip" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-focus">Donate</a>
            </div>
          </div>
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowDonateModal(false)} />
        </div>
      )}
    </div>
  );
};

