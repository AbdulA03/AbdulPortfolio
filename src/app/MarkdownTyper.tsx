import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownTyperProps {
  content: string;
  typingSpeed?: number;
  isGenerating?: boolean;
}

const MarkdownTyper: React.FC<MarkdownTyperProps> = ({ 
  content, 
  typingSpeed = 30,
  isGenerating = false
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!content) return;
    
    // Reset states when content changes
    setIsTyping(true);
    
    if (isGenerating) {
      setDisplayedText("Generating...");
      
      const delayTimer = setTimeout(() => {
        setDisplayedText('');
        startTyping();
      }, 2000);
      
      return () => clearTimeout(delayTimer);
    } else {
      setDisplayedText('');
      startTyping();
    }
    
    function startTyping() {
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= content.length) {
          setDisplayedText(content.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, typingSpeed);
      
      return () => clearInterval(typingInterval);
    }
  }, [content, typingSpeed, isGenerating]);

  // Handle the "Generating..." text with shimmer effect
  if (isGenerating && displayedText === "Generating...") {
    return <span className="shimmer-text">Generating...</span>;
  }

  return (
    <div className="markdown-typer">
      <ReactMarkdown>{displayedText}</ReactMarkdown>
      {isTyping && <span className="animate-pulse">▌</span>}
    </div>
  );
};

export default MarkdownTyper;
