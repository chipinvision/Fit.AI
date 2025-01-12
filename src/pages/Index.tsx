import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ImageUpload from "@/components/ImageUpload";
import { generateResponse } from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";

interface Message {
  content: string;
  isBot: boolean;
}

export const Index = () => {
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { content: "Hey I'm Fit.AI, I'm your virtual trainer always up to help. You can chat with me or upload your photo for a personalized fitness analysis!", isBot: true },
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
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageAnalysis = (analysis: string) => {
    setMessages((prev) => [
      ...prev,
      { content: "I've analyzed your photo. Here's my assessment:", isBot: true },
      { content: analysis, isBot: true }
    ]);
  };

  return ( 
    <div className="flex flex-col h-screen">
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-primary/10 p-4 shadow-sm z-50">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-[#6a8d73]">Fit.AI</h1>
          <a href="https://buymeacoffee.com/invisionchip" target="_blank" rel="noopener noreferrer">
            <button className="px-4 py-2 bg-[#6a8d73] text-[#f4fdd9] rounded-md hover:opacity-90 transition-opacity">
              Donate
            </button>
          </a>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pt-20 pb-32 px-4 bg-gradient-to-br from-[#f4fdd9]/5 to-[#6a8d73]/5">
        <div className="max-w-3xl mx-auto space-y-4">
          <ImageUpload 
            onImageAnalysis={handleImageAnalysis}
            onUploadStart={() => setIsLoading(true)}
          />
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

      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-primary/10 p-4 z-50">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
          <div className="text-center mt-2 text-sm text-gray-500">
            <p>Engineered by <b>
              <a href="https://invisionchipux.framer.ai/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="hover:text-[#6a8d73] transition-colors">
                Suresh Mishra
              </a>
            </b></p>
          </div>
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
              <a 
                href="https://buymeacoffee.com/invisionchip" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-4 py-2 bg-[#6a8d73] text-[#f4fdd9] rounded-md hover:opacity-90 transition-opacity"
              >
                Donate
              </a>
            </div>
          </div>
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowDonateModal(false)} />
        </div>
      )}
    </div>
  );
};