import { NextRequest, NextResponse } from "next/server";
import { ngoGraph } from "@/lib/langgraph/graph";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "El historial de mensajes es requerido y debe ser un array válido." },
        { status: 400 }
      );
    }

    // Invoke the compiled LangGraph workflow
    // LangGraph will run starting from the router node, branch conditional to retrieve (or skip),
    // and finally generate the output response.
    const result = await ngoGraph.invoke({
      messages: messages,
      // We start query, context, nextStep with default empty values
      query: "",
      context: "",
      nextStep: "generate"
    });

    // Get the updated messages. LangGraph reducer appends new messages.
    const updatedMessages = result.messages;
    const lastMessage = updatedMessages[updatedMessages.length - 1];

    return NextResponse.json({
      reply: lastMessage ? lastMessage.content : "Lo siento, no se pudo procesar la consulta.",
      messages: updatedMessages,
      query: result.query,
      context: result.context ? "Context was retrieved" : "No context retrieved"
    });
  } catch (error) {
    console.error("Error in API route /api/chat:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar el chat con LangGraph y Groq." },
      { status: 500 }
    );
  }
}
