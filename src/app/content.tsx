import React, { useState, useRef, useEffect } from 'react';
import { Code, Award, Telescope, Briefcase, GraduationCap, Star } from 'lucide-react';

export const contentData = {
  certifications: `## Certifications

- IBM AI Developer Professional Certificate
- IBM Combining Machine Learning and Rules for Cybersecurity
- Enterprise Design Thinking Practitioner
- Deep Learning Fundamentals`,

  education: `## Education

**Wentworth Institute of Technology** – Boston, MA  
Bachelor of Science in Computer Science, Expected August 2026

**Relevant Coursework:**
- Algorithms
- Data Structures
- Databases
- Network Programming
- Discrete Math
- Applications of AI
- Operating Systems`,

  experience: `## Experience

### RICOH USA, INC – Boston, MA  
*Customer Engineer Intern*  
*June 2024 – August 2024*  
- Developed technical documentation and performed network troubleshooting (TCP/IP, DNS, DHCP, Wi-Fi).  
- Managed server room operations, including configuration and maintenance of Cisco servers to ensure optimal network performance and security.  
- Collaborated with K-12 clients to manage and maintain technology for students and teachers, ensuring client satisfaction.

### Amazon – Marlborough, MA  
*Associate*  
*August 2023 – September 2023*  
- Efficiently managed warehouse packages and sorting procedures to ensure timely order fulfillment.  
- Gained insights into Amazon fulfillment processes and the robotics components of operations.

### Lifetime – Framingham, MA  
*Associate*  
*July 2021 – July 2023*  
- Trained new café hires in food preparation, customer service, and operational procedures.  
- Assisted with inventory management and ordering supplies to maintain appropriate stock levels.`,

  projects: `## Selected Projects

### Voice Translation Assistant
Developed a full-stack voice translation assistant that leverages IBM Watson Speech Libraries and Watsonx to enable seamless, real-time multilingual translation. I designed a responsive frontend using HTML, CSS, and JavaScript, and built a robust Flask-based backend for efficient voice input processing and playback. This project demonstrates my capability to integrate advanced AI services with user-centric design to create an innovative communication tool.

### Quantum Computing – Grover's Algorithm
Collaborated on a team project to implement Grover's Algorithm using IBM's Qiskit SDK. This initiative showcased the potential of quantum computing by achieving a quadratic speedup in search tasks compared to classical methods. Through this project, I explored applications of quantum computing in cryptography, optimization, and machine learning, further deepening my understanding of emerging technologies and their real-world impact.

### Real-Time ISS & Astronaut Tracking and Visualization Tool
Spearheaded the development of an interactive system that integrates RESTful APIs through Node-RED to provide live tracking of the International Space Station (ISS) and current astronaut data. I implemented a dynamic world map visualization and incorporated a responsive chatbot powered by ChatGPT-4, offering users an engaging and informative experience. This project highlights my skills in real-time data processing, API integration, and innovative UI design.

### Watch Party Application
As part of a collaborative team, I helped design and implement a watch party application that enables synchronous video playback and multi-language chat interactions. Utilizing modern frameworks such as Flask, Socket.IO, and Jinja, we created a platform that enhances social connectivity through a shared media experience. This project underscores my proficiency in full-stack web development and my ability to work effectively in a team setting.

---

Each project reflects my commitment to innovation and technical excellence, demonstrating a blend of creative problem solving and practical application of cutting-edge technologies. These experiences have not only enhanced my technical skills but have also prepared me to tackle complex challenges in real-world environments.`,

  reviews: `**Othman** – Boston, MA  
Great student`,

  technologies: `## Technologies

- **Web Technologies:** HTML, CSS, JavaScript  
- **Backend Technologies:** Python (Flask), Node.js, Node-RED  
- **Database Technologies:** SQL/Oracle, JSON  
- **Cloud & AI Platforms:** IBM Cloud, Watsonx, Hugging Face  
- **Networking & Security:** Cisco technologies, Wireshark, TCP/IP, DNS, DHCP, Wi-Fi  
- **Quantum Computing:** IBM Qiskit  
- **Containerization:** Docker`
};

const contentItems: (keyof typeof contentData)[] = [
  "technologies",
  "certifications",
  "projects",
  "experience",
  "education",
  "reviews",
  "technologies"
];

interface ContentProps {
  onContentSelect: (key: keyof typeof contentData) => void;
}

export default function Content({ onContentSelect }: ContentProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartXRef = useRef<number | null>(null);
  const wasDraggingRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const dragThreshold = 5;

  // When not dragging, resume the CSS animation after a short delay.
  useEffect(() => {
    if (!isDragging) {
      const timer = setTimeout(() => {
        setIsPaused(false);
        setDragOffset(0);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsPaused(true);
    }
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartXRef.current = e.clientX;
    wasDraggingRef.current = false;
    setIsPaused(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartXRef.current !== null) {
      const delta = e.clientX - dragStartXRef.current;
      if (!isDragging && Math.abs(delta) > dragThreshold) {
        setIsDragging(true);
        wasDraggingRef.current = true;
      }
      if (isDragging) {
        setDragOffset((prev) => prev + delta);
        dragStartXRef.current = e.clientX;
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartXRef.current = null;
  };

  const handleButtonClick = (key: keyof typeof contentData, event: React.MouseEvent) => {
    // Prevent button click if a drag was detected.
    if (wasDraggingRef.current) {
      event.preventDefault();
      return;
    }
    onContentSelect(key);
  };
  

  const renderButton = (key: keyof typeof contentData, index: number, groupId: number) => (
    <button
      key={`btn-${groupId}-${index}`}
      onClick={(e) => handleButtonClick(key, e)}
      className="flex items-center gap-2 border border-[#444444] text-sm px-4 py-2 rounded-full hover:bg-[#444444] transition text-gray-200"
    >
      {key === "technologies" && <Code className="w-4 h-4" />}
      {key === "certifications" && <Award className="w-4 h-4" />}
      {key === "projects" && <Telescope className="w-4 h-4" />}
      {key === "experience" && <Briefcase className="w-4 h-4" />}
      {key === "education" && <GraduationCap className="w-4 h-4" />}
      {key === "reviews" && <Star className="w-4 h-4" />}
      {key.charAt(0).toUpperCase() + key.slice(1)}
    </button>
  );  

  return (
    <div
      className="overflow-hidden w-full marquee-mask"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div
        className={`flex gap-3 whitespace-nowrap ${!isPaused ? 'animate-marquee' : ''}`}
        style={isPaused ? { transform: `translateX(${dragOffset}px)` } : {}}
      >
        <div className="flex gap-3">
          {contentItems.map((key, index) => renderButton(key, index, 0))}
        </div>
        <div className="flex gap-3">
          {contentItems.map((key, index) => renderButton(key, index, 1))}
        </div>
      </div>
    </div>
  );
}
