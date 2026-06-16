"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Globe, Heart, ShieldAlert, Cpu, BarChart3, Database } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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

import { DATA } from "./LegacyApp";
import ActionConfirmationCard from "../ui/components/agent/ActionConfirmationCard";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeProject?: any;
  setActiveProject?: (project: any) => void;
  page: string;
  setPage: (page: string) => void;
  savedCharts: any[];
  setSavedCharts: React.Dispatch<React.SetStateAction<any[]>>;
  savedMetrics: any[];
  setSavedMetrics: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function ChatSidebar({ 
  isOpen, 
  onClose, 
  activeProject, 
  setActiveProject,
  page,
  setPage,
  savedCharts,
  setSavedCharts,
  savedMetrics,
  setSavedMetrics
}: ChatSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "repo">("chat");
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

    // Inject system context just for the payload, don't show it in UI
    const payloadMessages = activeProject 
      ? [{ role: "system", content: `El usuario está actualmente visualizando el proyecto: "${activeProject.nombre}". Asume que cualquier pregunta sobre "este proyecto" o "aquí" se refiere a este.` }, ...updatedMessages]
      : updatedMessages;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: payloadMessages, pendingAction }),
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await response.json();
      
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
        
        if (data.requiresConfirmation && data.pendingAction) {
          setPendingAction({
            ...data.pendingAction,
            query: data.query || textToSend
          });
        } else {
          setPendingAction(null);
        }
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
          content: "Ocurrió un error de red o de servidor al conectarse con el asistente.",
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

  const handleConfirmAction = () => {
    if (pendingAction?.tool_name === "generate_chart_tool") {
      setSavedCharts(prev => [...prev, {
        ...pendingAction.parameters,
        query: pendingAction.query || "Consulta de gráfico"
      }]);
    } else if (pendingAction?.tool_name === "create_metric_config_tool") {
      setSavedMetrics(prev => [...prev, {
        ...pendingAction.parameters,
        query: pendingAction.query || "Consulta de métrica"
      }]);
    }
    setPendingAction(null);
    handleSendMessage("[CONFIRM_ACTION]");
  };

  const handleRejectAction = () => {
    setPendingAction(null);
    handleSendMessage("[REJECT_ACTION]");
  };

  // Helper function to format message text into JSX with markdown elements
  const renderMessageContent = (text: string) => {
    const parseInline = (inlineText: string): React.ReactNode[] => {
      // Split by markdown links like [Ver en la página de Repositorio](repositorio)
      const linkParts = inlineText.split(/(\[[^\]]+\]\([^)]+\))/g);
      return linkParts.map((part, idx) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (match) {
          const [, label, pageId] = match;
          return (
            <button
              key={`link-${idx}`}
              onClick={() => {
                setPage(pageId);
              }}
              style={{
                color: "#2563EB",
                background: "none",
                border: "none",
                padding: 0,
                font: "inherit",
                cursor: "pointer",
                textDecoration: "underline",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "2px"
              }}
            >
              {label}
            </button>
          );
        }

        const boldParts = part.split(/(\*\*.*?\*\*)/g);
        return boldParts.map((bPart, bIdx) => {
          if (bPart.startsWith("**") && bPart.endsWith("**")) {
            return <strong key={`${idx}-${bIdx}`}>{bPart.slice(2, -2)}</strong>;
          }
          const italicParts = bPart.split(/(\*.*?\*)/g);
          return italicParts.map((subPart, subIdx) => {
            if (subPart.startsWith("*") && subPart.endsWith("*")) {
              return <em key={`${idx}-${bIdx}-${subIdx}`}>{subPart.slice(1, -1)}</em>;
            }
            return subPart;
          });
        }).flat();
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
        position: 'fixed', top: 0, right: 0, width: '420px', height: '100vh',
        backgroundColor: '#fff', borderLeft: '1px solid #E2E8F0',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s cubic-bezier(.4,0,.2,1)',
        zIndex: 9999, display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 32px rgba(15,23,42,.10)'
      }}
    >
      <div className="app-container" style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
        {/* Header */}
      <header className="app-header" style={{ background: '#2563EB', borderBottom: 'none' }}>
        <div className="header-logo">
          <div className="logo-icon" style={{ background: 'rgba(255,255,255,.2)', borderRadius: 10 }}>
            <Sparkles size={18} color="#ffffff" />
          </div>
          <div className="logo-text">
            <h1 style={{ color: '#fff', fontSize: '16px' }}>Eco</h1>
            <span style={{ color: 'rgba(255,255,255,.7)', fontSize: '12px' }}>Pregúntame lo que necesites</span>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,.2)', color: '#fff', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>✕</button>
      </header>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #E2E8F0", background: "#F8FAFC" }}>
        <button 
          onClick={() => setActiveTab("chat")}
          style={{ flex: 1, padding: "12px", border: "none", background: activeTab === "chat" ? "#fff" : "transparent", borderBottom: activeTab === "chat" ? "2px solid #2563EB" : "2px solid transparent", cursor: "pointer", fontWeight: activeTab === "chat" ? 600 : 400, color: activeTab === "chat" ? "#1E293B" : "#64748B" }}>
          Chat
        </button>
        <button 
          onClick={() => setActiveTab("repo")}
          style={{ flex: 1, padding: "12px", border: "none", background: activeTab === "repo" ? "#fff" : "transparent", borderBottom: activeTab === "repo" ? "2px solid #2563EB" : "2px solid transparent", cursor: "pointer", fontWeight: activeTab === "repo" ? 600 : 400, color: activeTab === "repo" ? "#1E293B" : "#64748B", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          <Database size={16} /> Repositorio {savedCharts.length > 0 && <span style={{ background: "#2563EB", color: "#fff", fontSize: "10px", padding: "2px 6px", borderRadius: "10px" }}>{savedCharts.length}</span>}
        </button>
      </div>

      {/* Main Layout */}
      <div className="chat-layout" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>

        {/* Repositorio View */}
        {activeTab === "repo" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", background: "#F1F5F9" }}>
            {savedCharts.length === 0 ? (
              <div style={{ textAlign: "center", color: "#64748B", marginTop: "40px" }}>
                <BarChart3 size={40} style={{ margin: "0 auto", opacity: 0.3, marginBottom: "12px" }} />
                <p style={{ fontSize: "14px" }}>Aún no has guardado ningún gráfico.</p>
              </div>
            ) : (
              savedCharts.map((chart, idx) => (
                <div key={idx} style={{ padding: "16px", background: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <h4 style={{ fontSize: "15px", fontWeight: "bold", marginBottom: "16px", textAlign: "center", color: "#1E293B" }}>{chart.title}</h4>
                  <div style={{ height: "220px", width: "100%", marginBottom: "10px" }}>
                    {chart.type === "pie" ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={chart.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} fill="#8884d8">
                            {chart.data?.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"][index % 6]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chart.data}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" tick={{fontSize: 11}} interval={0} angle={-15} textAnchor="end" />
                          <YAxis tick={{fontSize: 12}} />
                          <Tooltip cursor={{fill: "#f1f5f9"}} />
                          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Chat Window */}
        {activeTab === "chat" && (
        <main className="chat-window">
          {/* Messages */}
          <div className="messages-container">
            {messages.filter(m => !m.content.includes("[CONFIRM_ACTION]") && !m.content.includes("[REJECT_ACTION]")).length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <Bot size={32} />
                </div>
                <h3>Hola, soy Eco</h3>
                <p>
                  Puedo ayudarte a encontrar voces, entender tus datos de impacto o preparar información para tus informes.
                </p>
              </div>
            ) : (
              messages.filter(m => !m.content.includes("[CONFIRM_ACTION]") && !m.content.includes("[REJECT_ACTION]")).map((msg, index, filteredArray) => (
              <React.Fragment key={index}>
                <div className={`message-wrapper ${msg.role}`}>
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
                            Voz
                          </span>
                        </>
                      )}
                    </div>
                    <div>{renderMessageContent(msg.content)}</div>
                  </div>
                </div>
                
                {/* Action Confirmation Rendered after the assistant message if pending */}
                {index === filteredArray.length - 1 && pendingAction && (
                  <div style={{ display: "flex", width: "100%", justifyContent: "flex-start", marginTop: "4px", marginBottom: "12px" }}>
                    <ActionConfirmationCard 
                      pendingAction={pendingAction}
                      onConfirm={handleConfirmAction}
                      onReject={handleRejectAction}
                    />
                  </div>
                )}
              </React.Fragment>
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
                    Buscando respuesta...
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
                disabled={isLoading || !!pendingAction}
              />
            </div>
            <button type="submit" className="send-button" disabled={isLoading || !input.trim() || !!pendingAction}>
              <Send size={18} />
            </button>
          </form>
        </main>
        )}
      </div>
    </div>
    </div>
  );
}
