import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, ChatMessage } from "@langchain/core/messages";
import type { Message as VercelChatMessage } from "ai";
import { loadEmbeddingsModel, loadVectorStore } from "@/utils/pinecone";
import { createRAGChain } from "@/utils/ragChain";
import { Document } from "@langchain/core/documents";

const formatVercelMessages = (message: VercelChatMessage) => {
  if (message.role === "user") {
    return new HumanMessage(message.content);
  } else if (message.role === "assistant") {
    return new AIMessage(message.content);
  } else {
    console.warn(
      `Unknown message type passed: "${message.role}". Falling back to generic message type.`
    );
    return new ChatMessage({ content: message.content, role: message.role });
  }
};

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];

    if (!messages.length) {
      throw new Error("No messages provided.");
    }

    const formattedPreviousMessages = messages
      .slice(0, -1)
      .map(formatVercelMessages);

    const currentMessage = messages[messages.length - 1].content;

    // Log the user's query
    console.log(`User Query: ${currentMessage}`);

    const chatModel = new ChatOpenAI({
      modelName: "gpt-4o",
      streaming: true,
      maxTokens: 4000,
    });

    const embeddings = loadEmbeddingsModel();

    const vectorstore = loadVectorStore({
      //   namespace
      embeddings,
    });

    let resolveWithDocuments: (value: Document[]) => void;
    const documentPromise = new Promise<Document[]>((resolve) => {
      resolveWithDocuments = resolve;
    });

    const retriever = (await vectorstore).asRetriever({
      k: 10,
      callbacks: [
        {
          handleRetrieverEnd(documents) {
            resolveWithDocuments(documents);
          },
        },
      ],
    });

    const ragChain = await createRAGChain(chatModel, retriever);

    let fullResponse = '';

    const stream = await ragChain.stream({
      input: currentMessage,
      chat_history: formattedPreviousMessages,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          fullResponse += chunk;
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
        // Log the full response after the stream is complete
        console.log(`AI Response: ${fullResponse}`);
      },
    });

    return new Response(readableStream);
  } catch (error: any) {
    console.error("Error in chat route:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}