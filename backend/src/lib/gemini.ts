import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("Missing OPENROUTER_API_KEY");
    _client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey,
    });
  }
  return _client;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function generateText(
  messages: ChatMessage[],
  systemPrompt: string,
  config?: { temperature?: number; maxTokens?: number; jsonMode?: boolean }
): Promise<string> {
  const client = getClient();
  const response = await client.chat.completions.create({
    model: "google/gemini-3.5-flash",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.filter((m) => m.role !== "system"),
    ],
    temperature: config?.temperature ?? 0.5,
    max_tokens: config?.maxTokens ?? 800,
    ...(config?.jsonMode && { response_format: { type: "json_object" } }),
  });
  return response.choices[0]?.message?.content || "";
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY for embeddings");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY for embeddings");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.batchEmbedContents({
    requests: texts.map((text) => ({
      content: { parts: [{ text }], role: "user" },
    })),
  });
  return result.embeddings.map((e) => e.values);
}
