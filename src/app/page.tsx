'use client';

import { useState, useEffect } from 'react';
import { Menu, Pencil, ChevronDown, ArrowUp, Download, Share2 } from 'lucide-react';
import Content, { contentData } from './content';
import MarkdownTyper from './MarkdownTyper';

// Helper: Determine typing speed based on text length
function getTypingSpeed(text: string) {
  return text.length > 200 ? 8 : 15;
}

export default function Home() {
  const defaultTitle = "What can I help with?";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [nameDropdownOpen, setNameDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedName, setSelectedName] = useState("Abdul Abdulnabi");

  // State for content and user input
  const [generatedText, setGeneratedText] = useState(defaultTitle);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMarkdown, setIsMarkdown] = useState(false);
  const [userInput, setUserInput] = useState('');

  // Typing effect for the default title
  useEffect(() => {
    if (generatedText === defaultTitle) {
      setIsMarkdown(false);
      setIsTyping(true);
      setDisplayedText('');
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= generatedText.length) {
          setDisplayedText(generatedText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 15);
      return () => clearInterval(typingInterval);
    }
  }, [generatedText, defaultTitle]);

  // Handle content selection from the Content component
  const handleContentSelect = (contentKey: keyof typeof contentData) => {
      setGeneratedText(contentData[contentKey]);
      setIsMarkdown(true);
  };

  // Fetch chat response for AbdulGPT mode
  async function fetchChatResponse() {
    try {
      if (!userInput.trim()) return;
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.body) {
        const fullText = await response.text();
        setGeneratedText(fullText);
        setIsMarkdown(true);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let accumulatedText = "";
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        accumulatedText += chunkValue;
        setGeneratedText(accumulatedText);
        setIsMarkdown(true);
      }
    } catch (error) {
      console.error("Error fetching chat response:", error);
      setGeneratedText("Error: Unable to fetch chat response.");
      setIsMarkdown(false);
    }
  }

  // Handler for sending the message (only active for AbdulGPT)
  const handleSendMessage = async () => {
    if (isTyping || selectedName !== "AbdulGPT") return;
    if (!userInput.trim()) return;
    setGeneratedText("");
    await fetchChatResponse();
    setUserInput('');
  };

  return (
    <div className="relative h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-[#171717] p-4 z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <h2 className="text-lg font-bold mb-4">About Me</h2>
        <ul className="space-y-2">
          <li>About Me</li>
          <li>Skills</li>
          <li>Projects</li>
          <li>Contact</li>
        </ul>
      </div>

      {/* Top Left Controls */}
      <div className={`absolute top-4 left-4 z-20 flex items-center gap-3 transition-all duration-300 ${sidebarOpen ? 'ml-64' : ''}`}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl hover:bg-[#303030] transition">
          <Menu className="w-5 h-5 text-gray-300" />
        </button>
        <a href="mailto:abdulabdulnabi03@gmail.com" target="_blank" rel="noopener noreferrer">
          <button className="p-2 rounded-xl hover:bg-[#303030] transition">
            <Pencil className="w-5 h-5 text-[#A9ACB1]" />
          </button>
        </a>
        <div className="relative">
          <button onClick={() => setNameDropdownOpen(!nameDropdownOpen)} className="flex items-center gap-3 p-1 rounded-xl hover:bg-[#303030] transition">
            <span className="text-gray-200 font-medium ml-2">{selectedName}</span>
            <ChevronDown className="w-4 h-5 text-gray-400" />
          </button>
          {nameDropdownOpen && (
            <div className="absolute left-0 top-10 bg-[#303030] text-sm rounded-2xl shadow-lg p-2 w-56">
              <p className="px-2 py-1 text-xs text-gray-400">Model</p>
              <div onClick={() => { setSelectedName("Abdul Abdulnabi"); setNameDropdownOpen(false); }} className="hover:bg-[#424242] px-2 py-2 rounded-xl cursor-pointer">
                <p className="font-semibold text-gray-200">Abdul Abdulnabi</p>
                <p className="text-xs text-gray-400">Great for general information</p>
              </div>
              <div onClick={() => { setSelectedName("AbdulGPT"); setNameDropdownOpen(false); }} className="hover:bg-[#424242] px-2 py-2 rounded-xl cursor-pointer">
                <p className="font-semibold text-gray-200">
                  AbdulGPT
                  <span className="ml-1 bg-gray-600 text-white text-[10px] py-[1px] px-2 rounded-full align-middle">BETA</span>
                </p>
                <p className="text-xs text-gray-400">Ask Abduls Assistant</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        <button className="flex items-center gap-2 border border-[#444444] px-4 py-2 rounded-full text-sm text-gray-200 hover:bg-[#444444] transition">
          <Share2 className="h-4 w-4" />
          Share
        </button>
        <div className="relative group">
          <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="w-10 h-10 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center hover:brightness-110 transition">
            AB
          </button>
          {profileDropdownOpen && (
            <div className="absolute right-1 mt-2 flex flex-col gap-2">
              <a href="https://github.com/AbdulA03" target="_blank" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#444444]">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.388-1.334-1.758-1.334-1.758-1.09-.744.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.495.997.11-.775.418-1.305.76-1.605-2.665-.3-5.467-1.333-5.467-5.932 0-1.31.467-2.382 1.235-3.222-.125-.303-.535-1.523.115-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.655 1.653.245 2.873.12 3.176.77.84 1.23 1.912 1.23 3.222 0 4.61-2.805 5.63-5.475 5.922.43.37.82 1.096.82 2.21 0 1.595-.015 2.88-.015 3.27 0 .32.215.695.825.577C20.565 22.295 24 17.8 24 12.5 24 5.87 18.63.5 12 .5z" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/abdul-abdulnabi/" target="_blank" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#444444]">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5C3.34 3.5 2 4.84 2 6.48s1.34 2.98 2.98 2.98 2.98-1.34 2.98-2.98S6.62 3.5 4.98 3.5zM2.4 20.5h5.16V9H2.4v11.5zM9.57 9h4.93v1.56h.07c.69-1.2 2.36-2.48 4.85-2.48 5.2 0 6.16 3.43 6.16 7.89V20.5H20.4v-6.03c0-1.44-.03-3.29-2-3.29-2 0-2.3 1.56-2.3 3.18V20.5h-5.13V9z" />
                </svg>
              </a>
              <a href="/Abdul-Abdulnabi-Resume.pdf" download className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-600">
                <Download className="w-4 h-4 text-white" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {/* Wrap content in a container that respects the sidebar */}
      <div className={`flex flex-col pb-48 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`} style={{ height: 'calc(100vh - 200px)' }}>
        {generatedText === defaultTitle ? (
          // Default title container (centered with chat bubble)
          <div className="w-full px-16 flex-grow flex items-center justify-center">
            <div className="max-w-[766px] mx-auto text-center">
              <p className="text-3xl font-bold text-gray-200">
                {displayedText}
                {isTyping && <span className="animate-pulse">▌</span>}
              </p>
            </div>
          </div>
        ) : (
          // Dynamic content container with a scrollable inner wrapper
          <div className="w-full pt-40 px-16">
            <div
              className="max-w-[766px] mx-auto text-left text-gray-200 mb-4 overflow-y-auto custom-scrollbar"
              style={{ maxHeight: 'calc(100vh - 200px)', paddingRight: '5px' }}
            >
              {isMarkdown ? (
                <MarkdownTyper 
                  content={generatedText} 
                  typingSpeed={getTypingSpeed(generatedText)}
                  isGenerating={generatedText !== defaultTitle && generatedText !== ""}
                />
              ) : (
                <p className="text-base">
                  {displayedText}
                  {isTyping && <span className="animate-pulse">▌</span>}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Fixed Chat Input (AbdulGPT only) */}
      {selectedName === "AbdulGPT" && (
        <div className={`fixed bottom-32 left-0 right-0 flex justify-center mt-160 mb-8 z-20 transition-all duration-300 ${sidebarOpen ? 'pl-64' : ''}`}>
          <div className="bg-[var(--bubble)] w-[500px] h-[50px] rounded-[24px] px-4 py-2 flex items-center">
            <input
              type="text"
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full bg-transparent text-gray-200 outline-none"
            />
          </div>
        </div>
      )}

      {/* Fixed Chat Bubble Area */}
      <div className={`fixed bottom-8 left-0 right-0 flex justify-center items-end z-20 transition-all duration-300 ${sidebarOpen ? 'pl-64' : ''}`}>
        <div className="bg-[var(--bubble)] w-[766px] h-[120px] rounded-[24px] px-6 py-4 text-center flex flex-col justify-between relative">
          <Content onContentSelect={handleContentSelect} />
          <button
            onClick={handleSendMessage}
            disabled={selectedName !== "AbdulGPT" || isTyping}
            className={`absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition ${
              selectedName !== "AbdulGPT" || isTyping
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[#FFFFFF] text-white hover:bg-[#C1C1C1]"
            }`}
          >
            <ArrowUp className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>
      
      {/* Fixed Text Under Bubble Area */}
      <div className={`fixed bottom-2 left-0 right-0 text-center z-20 transition-all duration-300 ${sidebarOpen ? 'pl-64' : ''}`}>
        <p className="text-xs text-gray-400">
          Abdul can make mistakes, But never the same one twice.
        </p>
      </div>
    </div>
  );
}
