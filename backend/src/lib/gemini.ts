import { GoogleGenerativeAI } from "@google/generative-ai";

let _genAI: GoogleGenerativeAI | null = null;

export function getGenAI(): GoogleGenerativeAI {
  if (!_genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");
    _genAI = new GoogleGenerativeAI(apiKey);
  }
  return _genAI;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export function toGeminiContents(messages: ChatMessage[]) {
  const contents: { role: string; parts: { text: string }[] }[] = [];

  for (const msg of messages) {
    if (msg.role === "system") continue;
    const role = msg.role === "assistant" ? "model" : "user";
    const last = contents[contents.length - 1];
    if (last && last.role === role) {
      last.parts.push({ text: msg.content });
    } else {
      contents.push({ role, parts: [{ text: msg.content }] });
    }
  }

  if (contents.length > 0 && contents[0].role !== "user") {
    contents.unshift({ role: "user", parts: [{ text: "." }] });
  }

  return contents;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.batchEmbedContents({
    requests: texts.map((text) => ({
      content: { parts: [{ text }], role: "user" },
    })),
  });
  return result.embeddings.map((e) => e.values);
}
