"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Globe, Heart, ShieldAlert, Cpu } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// Static mock NGOs for sidebar indexing (matches ngos.json)
const SIDEBAR_NGOS = [
  { name: "EcoVida", focus: "Medio Ambiente", hq: "Lima, Perú" },
  { name: "EducaYa", focus: "Educación", hq: "Santiago, Chile" },
  { name: "SaludParaTodos", focus: "Salud", hq: "La Paz, Bolivia" },
  { name: "Derechos Digitales", focus: "Derechos Humanos", hq: "Buenos Aires, Arg" },
  { name: "Alianza Femenina", focus: "Desarrollo Económico", hq: "Medellín, Col" },
];

const QUICK_SUGGESTIONS = [
  "¿Qué ONGs trabajan en medio ambiente?",
  "Dime los detalles de la ONG EcoVida",
  "Muéstrame el presupuesto anual de EducaYa",
  "¿Qué impacto tiene SaludParaTodos?",
  "Detalles del proyecto Semilla de Negocio",
];

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Send message handler
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: textToSend };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await response.json();
      
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Lo siento, no obtuve una respuesta válida del agente." },
        ]);
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Ocurrió un error de red o de servidor al comunicarse con LangGraph.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  // Helper function to format message text into JSX with markdown elements
  const renderMessageContent = (text: string) => {
    const parseInline = (inlineText: string): React.ReactNode[] => {
      // Split by double asterisks for bolding
      const boldParts = inlineText.split(/(\*\*.*?\*\*)/g);
      return boldParts.map((part, idx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={idx}>{part.slice(2, -2)}</strong>;
        }
        // Split by single asterisks for italics
        const italicParts = part.split(/(\*.*?\*)/g);
        return italicParts.map((subPart, subIdx) => {
          if (subPart.startsWith("*") && subPart.endsWith("*")) {
            return <em key={`${idx}-${subIdx}`}>{subPart.slice(1, -1)}</em>;
          }
          return subPart;
        });
      }).flat();
    };

    return text.split("\n").map((line, i) => {
      if (line.startsWith("### ")) {
        return (
          <h3 key={i} style={{ marginTop: i > 0 ? "1rem" : "0", marginBottom: "0.5rem" }}>
            {line.slice(4)}
          </h3>
        );
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={i} style={{ marginLeft: "1.25rem", marginBottom: "0.25rem" }}>
            {parseInline(line.slice(2))}
          </li>
        );
      }
      if (line.trim() === "") {
        return <div key={i} style={{ height: "0.5rem" }} />;
      }
      return (
        <p key={i} style={{ marginBottom: "0.5rem" }}>
          {parseInline(line)}
        </p>
      );
    });
  };

  return (
    <div 
      style={{
        position: 'fixed', top: 0, right: 0, width: '45vw', minWidth: '400px', height: '100vh', 
        backgroundColor: '#EBEAE6', borderLeft: '1px solid #E0DFDB',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s ease-in-out',
        zIndex: 9999, display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 20px rgba(26,26,26,.08)'
      }}
    >
      <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#222222', color: 'white', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
      <div className="app-container" style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
        {/* Header */}
      <header className="app-header">
        <div className="header-logo">
          <div className="logo-icon">
            <Heart size={20} color="#ffffff" fill="#ffffff" />
          </div>
          <div className="logo-text">
            <h1>ONG RAG Explorer</h1>
            <span>Agente LangGraph Activo</span>
          </div>
        </div>
        <div className="header-meta">
          <div className="tech-tag">
            <Cpu size={12} />
            <span>Llama 3.3 & Groq</span>
          </div>
          <div className="meta-pill">Mock DB Mode</div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="chat-layout" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>

        {/* Chat Window */}
        <main className="chat-window">
          {/* Messages */}
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <Bot size={32} />
                </div>
                <h3>¡Hola! Soy tu asistente RAG</h3>
                <p>
                  Pregúntame sobre proyectos, presupuestos, enfoques de impacto o información general de
                  las ONGs en nuestra base de datos.
                </p>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Utilizo LangGraph para orquestar la búsqueda y Groq con Llama 3 para responder.
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`message-wrapper ${msg.role}`}>
                  <div className="message-bubble">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                      {msg.role === "user" ? (
                        <>
                          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#4A6352" }}>Tú</span>
                          <User size={12} color="#4A6352" />
                        </>
                      ) : (
                        <>
                          <Bot size={12} color="#5D7A66" />
                          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#3D6B47" }}>
                            Asistente RAG
                          </span>
                        </>
                      )}
                    </div>
                    <div>{renderMessageContent(msg.content)}</div>
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div className="message-wrapper assistant">
                <div className="message-bubble" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    Ejecutando LangGraph RAG...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>



          {/* Input Form */}
          <form onSubmit={handleSubmit} className="chat-input-bar">
            <div className="input-container">
              <input
                type="text"
                className="chat-input"
                placeholder="Escribe tu consulta sobre ONGs..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <button type="submit" className="send-button" disabled={isLoading || !input.trim()}>
              <Send size={18} />
            </button>
          </form>
        </main>
      </div>
    </div>
    </div>
  );
}
