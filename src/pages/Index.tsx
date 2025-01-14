import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/ChatMessage";
import ImageUpload from "@/components/ImageUpload";
import { generateResponse } from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

interface Message {
  content: string;
  isBot: boolean;
}

interface BeforeInstallPromptEvent extends Event {
  platforms: string[];
  userChoice: Promise<{ outcome: string; platform: string }>;
  prompt(): void;
}

export const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    { content: "Hey I'm Fit.AI, I'm your virtual trainer always up to help. You can chat with me or upload your photo for a personalized fitness analysis!", isBot: true },
  ]); 
  const [isLoading, setIsLoading] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const beforeInstallPromptHandler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(false);
    };    
    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);
    window.addEventListener('appinstalled', () => setShowInstallPrompt(false));
    return () => window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { 
    scrollToBottom();
    // Show install prompt after the first response if deferredPrompt is available and not already shown
    if (messages.length > 1 && deferredPrompt && !showInstallPrompt) {
      setShowInstallPrompt(true);
    }
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
    setShowImageUpload(false);
    setMessages((prev) => [
      ...prev,
      { content: "I've analyzed your photo. Here's my assessment:", isBot: true },
      { content: analysis, isBot: true }
    ]);
  };

  return ( 
    <div className="flex flex-col h-screen">
      <Header />

      <main className="flex-1 overflow-y-auto pt-20 pb-32 px-4 bg-gradient-to-br from-[#f4fdd9]/5 to-[#6a8d73]/5">
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

      {/* Install Prompt Modal */}
      <Sheet open={showInstallPrompt} onOpenChange={setShowInstallPrompt}>
        <SheetContent side="bottom" className="p-4">
          <SheetHeader>
            <SheetTitle>Install Fit.AI</SheetTitle>
          </SheetHeader>
          <div className="text-center mt-4">
            <p>
              Install Fit.AI for a better experience and offline access.
            </p>            
            {deferredPrompt && (
              <Button
                onClick={() => {
                  // Trigger PWA installation
                  deferredPrompt.prompt();
                  setShowInstallPrompt(false);
                  setDeferredPrompt(null);
                }}
                className="mt-4"
              >
                Install
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={showImageUpload} onOpenChange={setShowImageUpload}>
        <SheetContent side="bottom" className="h-[400px]">
          <SheetHeader>
            <SheetTitle>Upload Your Photo</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <ImageUpload 
              onImageAnalysis={handleImageAnalysis}
              onUploadComplete={() => setIsLoading(false)}
              onCloseModal={() => setShowImageUpload(false)}
              onUploadStart={() => setIsLoading(true)}
            />
          </div>
        </SheetContent>
      </Sheet>

      <Footer 
        onSend={handleSendMessage}
        isLoading={isLoading}
        onImageUploadClick={() => setShowImageUpload(true)}
      />
    </div>
  );
};