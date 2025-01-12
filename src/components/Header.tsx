import React from "react";

export const Header = () => {
  return (
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
  );
};