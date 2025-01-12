import React from "react";
import ChatInput from "./ChatInput";

interface FooterProps {
  onSend: (content: string) => void;
  isLoading: boolean;
  onImageUploadClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSend, isLoading, onImageUploadClick }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-primary/10 p-4 z-50">
      <div className="max-w-3xl mx-auto">
        <ChatInput 
          onSend={onSend} 
          disabled={isLoading}
          onImageUploadClick={onImageUploadClick} 
        />
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
  );
};