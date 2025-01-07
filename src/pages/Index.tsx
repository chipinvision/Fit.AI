import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { generateResponse } from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";

interface Message {
  content: string;
  isBot: boolean;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('GEMINI_API_KEY'));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const sendInitialMessage = async () => {
      if (!apiKey) {
        toast({
          title: "API Key Required",
          description: "Please enter your Gemini API key to start chatting.",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      try {
        const response = await generateResponse([], apiKey);
        setMessages([{ content: response, isBot: true }]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to start the conversation. Please check your API key.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    sendInitialMessage();
  }, [apiKey]);

  const handleSendMessage = async (content: string) => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key to start chatting.",
        variant: "destructive",
      });
      return;
    }

    const newMessage = { content, isBot: false };
    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await generateResponse([...messages, newMessage], apiKey);
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

  const handleApiKeySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newApiKey = formData.get('apiKey') as string;
    if (newApiKey) {
      localStorage.setItem('GEMINI_API_KEY', newApiKey);
      setApiKey(newApiKey);
      toast({
        title: "Success",
        description: "API key has been saved.",
      });
    }
  };

  if (!apiKey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 to-primary-foreground/5">
        <div className="w-full max-w-md space-y-8 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-primary">Fit.AI</h2>
            <p className="mt-2 text-gray-600">Your Personal AI Fitness Coach</p>
          </div>
          <form onSubmit={handleApiKeySubmit} className="mt-8 space-y-6">
            <div className="rounded-md">
              <input
                type="password"
                name="apiKey"
                required
                className="relative block w-full rounded-xl border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="Enter your Gemini API key"
              />
            </div>
            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-200"
              >
                Start Your Fitness Journey
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-primary/5 to-primary-foreground/5">
      <header className="bg-white/80 backdrop-blur-sm border-b border-primary/10 p-4 shadow-sm">
        <h1 className="text-3xl font-bold text-primary text-center">
          Fit.AI
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
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
    </div>
  );
};

export default Index;