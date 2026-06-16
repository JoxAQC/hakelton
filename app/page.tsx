"use client";

import React, { useState, useEffect } from "react";
import LegacyApp, { loadSupabaseData } from "./LegacyApp";
import ChatSidebar from "./ChatSidebar";
import "./legacy-styles.css";
import { MessageCircle } from "lucide-react";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Elevated dashboard state for cross-component communication (Human-in-the-loop)
  const [page, setPage] = useState("inicio");
  const [savedCharts, setSavedCharts] = useState<any[]>([]);
  const [savedMetrics, setSavedMetrics] = useState<any[]>([]);

  useEffect(() => {
    loadSupabaseData().then(() => setDataLoaded(true));
  }, []);

  if (!dataLoaded) {
    return <div style={{ height: "100vh", display: "grid", placeItems: "center", color: "var(--muted)", fontFamily: "var(--sans)" }}>Cargando entorno Demo de Supabase...</div>;
  }

  return (
    <>
      {/* Legacy Prototype UI */}
      <LegacyApp 
        activeProject={activeProject} 
        setActiveProject={setActiveProject} 
        page={page}
        setPage={setPage}
        savedCharts={savedCharts}
        setSavedCharts={setSavedCharts}
        savedMetrics={savedMetrics}
        setSavedMetrics={setSavedMetrics}
      />

      {/* Floating Assistant Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        style={{
          position: "fixed", bottom: "28px", right: "28px",
          backgroundColor: "#2563EB", color: "white", border: "none",
          borderRadius: "50%", width: "52px", height: "52px", padding: "0",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 24px rgba(37,99,235,.40), 0 2px 8px rgba(0,0,0,.10)",
          zIndex: 9998, fontFamily: "inherit", fontSize: "14px", fontWeight: 700,
          letterSpacing: "-.01em", transition: "all 0.2s ease",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(37,99,235,.50), 0 2px 8px rgba(0,0,0,.12)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 24px rgba(37,99,235,.40), 0 2px 8px rgba(0,0,0,.10)";
        }}
      >
        <MessageCircle size={22} />
      </button>

      {/* Pop-up Chat Sidebar */}
      <ChatSidebar 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        activeProject={activeProject} 
        setActiveProject={setActiveProject} 
        page={page}
        setPage={setPage}
        savedCharts={savedCharts}
        setSavedCharts={setSavedCharts}
        savedMetrics={savedMetrics}
        setSavedMetrics={setSavedMetrics}
      />
    </>
  );
}
