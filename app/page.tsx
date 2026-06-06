"use client";

import React, { useState } from "react";
import LegacyApp from "./LegacyApp";
import ChatSidebar from "./ChatSidebar";
import "./legacy-styles.css";
import { MessageCircle } from "lucide-react";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  return (
    <>
      {/* Legacy Prototype UI */}
      <LegacyApp activeProject={activeProject} setActiveProject={setActiveProject} />

      {/* Floating Action Button to open Chat Sidebar */}
      <button 
        onClick={() => setIsChatOpen(true)}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          backgroundColor: "var(--primary-color, #3b82f6)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          zIndex: 9998,
          transition: "transform 0.2s ease"
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
        title="Abrir Asistente / Ingesta"
      >
        <MessageCircle size={28} />
      </button>

      {/* Pop-up Chat Sidebar */}
      <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} activeProject={activeProject} setActiveProject={setActiveProject} />
    </>
  );
}
