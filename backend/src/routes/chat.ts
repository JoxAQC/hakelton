import { Router } from "express";
import { ngoGraph } from "../lib/langgraph/graph.js";

export const chatRouter = Router();

chatRouter.post("/", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({
        error: "El historial de mensajes es requerido y debe ser un array válido.",
      });
      return;
    }

    const result = await ngoGraph.invoke({
      messages,
      query: "",
      context: "",
      nextStep: "generate",
    });

    const updatedMessages = result.messages;
    const lastMessage = updatedMessages[updatedMessages.length - 1];

    res.json({
      reply: lastMessage
        ? lastMessage.content
        : "Lo siento, no se pudo procesar la consulta.",
      messages: updatedMessages,
      query: result.query,
      context: result.context ? "Context was retrieved" : "No context retrieved",
    });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({
      error: "Ocurrió un error al procesar el chat.",
    });
  }
});
